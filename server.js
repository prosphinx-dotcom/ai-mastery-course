const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Env check ─────────────────────────────────────────────────
const REQUIRED = ['SUPABASE_URL','SUPABASE_SERVICE_KEY','JWT_SECRET','STRIPE_SECRET_KEY','STRIPE_PAYMENT_LINK'];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) console.error('❌ Missing env vars:', missing.join(', '));

// ── Stripe (safe init) ────────────────────────────────────────
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch(e) { console.error('Stripe init failed:', e.message); }

// ── Supabase ──────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// ── Stripe webhook MUST come before express.json() ───────────
// Stripe needs raw body to verify the signature
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (secret && stripe) {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch(e) {
    console.error('Webhook error:', e.message);
    return res.status(400).send('Webhook Error: ' + e.message);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const email = session.customer_details?.email || session.customer_email;
    const paymentId = session.payment_intent || session.id;

    console.log(`Payment complete — userId: ${userId}, email: ${email}`);

    if (userId) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('id', userId);
      if (error) console.error('Supabase update error:', error);
      else console.log('✅ Access granted to user:', userId);
    } else if (email) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('email', email.toLowerCase());
      if (error) console.error('Supabase email update error:', error);
      else console.log('✅ Access granted to email:', email);
    }
  }

  res.json({ received: true });
});

// ── JSON body parser (after webhook) ─────────────────────────
app.use(express.json());

// ── Auth helpers ──────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.cookies.aim_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({ error: 'Session expired — please sign in again' });
  }
}

function getAuthUser(req) {
  try {
    const token = req.cookies.aim_token;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

function setAuthCookie(res, token) {
  res.cookie('aim_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
}

// ── Health ────────────────────────────────────────────────────
app.get('/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ── Register ──────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    // Check if email exists
    const { data: existing } = await supabase
      .from('profiles').select('id').eq('email', email.toLowerCase()).maybeSingle();
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('profiles')
      .insert({ email: email.toLowerCase(), password_hash })
      .select('id, email, has_access')
      .single();

    if (error) {
      console.error('Register insert error:', error);
      return res.status(500).json({ error: 'Registration failed: ' + error.message });
    }

    // Create stats row
    await supabase.from('user_stats').insert({ user_id: user.id });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    res.json({ success: true, user });
  } catch(e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── Login ─────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const { data: user, error } = await supabase
      .from('profiles').select('*').eq('email', email.toLowerCase()).maybeSingle();

    if (error || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    res.json({ success: true, user: { id: user.id, email: user.email, has_access: user.has_access } });
  } catch(e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── Logout ────────────────────────────────────────────────────
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('aim_token');
  res.json({ success: true });
});

// ── Me ────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles').select('id, email, has_access, created_at')
      .eq('id', req.user.id).single();

    const { data: stats } = await supabase
      .from('user_stats').select('xp, streak, last_activity')
      .eq('user_id', req.user.id).single();

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user, stats: stats || { xp: 0, streak: 0 } });
  } catch(e) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

// ── Progress ──────────────────────────────────────────────────
app.get('/api/progress', requireAuth, async (req, res) => {
  const { data } = await supabase.from('progress').select('*').eq('user_id', req.user.id);
  res.json(data || []);
});

app.post('/api/progress', requireAuth, async (req, res) => {
  const { lesson_day, completed, score } = req.body;
  try {
    const { data, error } = await supabase.from('progress').upsert({
      user_id: req.user.id, lesson_day, completed,
      score: score || 0,
      completed_at: completed ? new Date().toISOString() : null
    }, { onConflict: 'user_id,lesson_day' }).select().single();

    if (error) throw error;

    if (completed) {
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await supabase.from('user_stats').select('*')
        .eq('user_id', req.user.id).single();
      const xpGain = 10 + (score || 0);
      const lastActivity = stats?.last_activity;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = (lastActivity === yesterday || lastActivity === today)
        ? (stats?.streak || 0) + (lastActivity !== today ? 1 : 0) : 1;
      await supabase.from('user_stats').upsert({
        user_id: req.user.id,
        xp: (stats?.xp || 0) + xpGain,
        streak: newStreak,
        last_activity: today
      }, { onConflict: 'user_id' });
    }
    res.json({ success: true, progress: data });
  } catch(e) {
    console.error('Progress error:', e);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// ── Checkout ──────────────────────────────────────────────────
app.post('/api/checkout', requireAuth, (req, res) => {
  const link = process.env.STRIPE_PAYMENT_LINK;
  if (!link) return res.status(500).json({ error: 'Payment not configured. Contact support.' });
  res.json({ url: `${link}?client_reference_id=${req.user.id}` });
});

// ── Gate app.js ───────────────────────────────────────────────
app.get('/app.js', async (req, res, next) => {
  const user = getAuthUser(req);
  if (!user) return serveStub(res);
  try {
    const { data } = await supabase.from('profiles')
      .select('has_access').eq('id', user.id).single();
    if (data?.has_access) return next();
    serveStub(res);
  } catch { serveStub(res); }
});

function serveStub(res) {
  res.type('application/javascript');
  res.send(`
(function(){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('view--active');});
  var h=document.getElementById('view-hero'); if(h) h.classList.add('view--active');
})();
function showView(v){
  if(v!=='hero'){var m=document.getElementById('paywall-modal');if(m)m.style.display='flex';return;}
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('view--active');});
  var h=document.getElementById('view-hero');if(h)h.classList.add('view--active');
}
function renderDashboard(){}
function generateCert(){}
function updateStats(){}
  `);
}

// ── Static files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Mastery running on port ${PORT}`);
  if (missing.length) console.warn('⚠️  Missing:', missing.join(', '));
  else console.log('✅ All environment variables present');
});
