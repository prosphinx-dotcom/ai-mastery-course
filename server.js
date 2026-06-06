const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Env Validation ────────────────────────────────────────────
const REQUIRED_VARS = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_PAYMENT_LINK'];
const missing = REQUIRED_VARS.filter(v => !process.env[v]);
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Set these in Render → Environment before starting.');
  // Don't crash — still start so you can see logs, but log clearly
}

// ── Supabase ──────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Stripe webhook needs raw body — must be before express.static
app.use('/webhook', express.raw({ type: 'application/json' }));

// ── Auth Middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.cookies.aim_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

function getAuthUser(req) {
  try {
    const token = req.cookies.aim_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ── Health / Keep-Alive ──────────────────────────────────────
app.get('/ping', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Auth Routes ───────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('profiles')
      .insert({ email: email.toLowerCase(), password_hash })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('user_stats').insert({ user_id: user.id });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('aim_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.json({ success: true, user: { id: user.id, email: user.email, has_access: user.has_access } });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('aim_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.json({ success: true, user: { id: user.id, email: user.email, has_access: user.has_access } });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('aim_token');
  res.json({ success: true });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, has_access, created_at')
      .eq('id', req.user.id)
      .single();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('xp, streak, last_activity')
      .eq('user_id', req.user.id)
      .single();

    res.json({ user, stats });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

// ── Progress Routes ───────────────────────────────────────────

app.get('/api/progress', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', req.user.id);
  res.json(data || []);
});

app.post('/api/progress', requireAuth, async (req, res) => {
  const { lesson_day, completed, score } = req.body;
  try {
    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: req.user.id,
        lesson_day,
        completed,
        score: score || 0,
        completed_at: completed ? new Date().toISOString() : null
      }, { onConflict: 'user_id,lesson_day' })
      .select()
      .single();

    if (error) throw error;

    if (completed) {
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', req.user.id)
        .single();

      const xpGain = 10 + (score || 0);
      const lastActivity = stats?.last_activity;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = (lastActivity === yesterday || lastActivity === today)
        ? (stats?.streak || 0) + (lastActivity !== today ? 1 : 0)
        : 1;

      await supabase.from('user_stats').upsert({
        user_id: req.user.id,
        xp: (stats?.xp || 0) + xpGain,
        streak: newStreak,
        last_activity: today
      }, { onConflict: 'user_id' });
    }

    res.json({ success: true, progress: data });
  } catch (e) {
    console.error('Progress error:', e);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// ── Stripe Routes ─────────────────────────────────────────────

// Create checkout — user must be logged in
app.post('/api/checkout', requireAuth, async (req, res) => {
  const paymentLink = process.env.STRIPE_PAYMENT_LINK;
  if (!paymentLink) {
    console.error('STRIPE_PAYMENT_LINK not set');
    return res.status(500).json({ error: 'Payment not configured. Contact support.' });
  }
  // Pass user ID so webhook can activate the right account
  const url = `${paymentLink}?client_reference_id=${req.user.id}`;
  res.json({ url });
});

// Stripe webhook — activates account after payment
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
      event = JSON.parse(req.body);
    }
  } catch (e) {
    console.error('Webhook verification failed:', e.message);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const paymentId = session.payment_intent || session.id;

    console.log(`Webhook: payment completed. userId=${userId}, email=${customerEmail}`);

    if (userId) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('id', userId);
      if (error) console.error('Supabase update by ID failed:', error);
      else console.log(`✅ Access granted to user ID: ${userId}`);
    } else if (customerEmail) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('email', customerEmail.toLowerCase());
      if (error) console.error('Supabase update by email failed:', error);
      else console.log(`✅ Access granted to email: ${customerEmail}`);
    } else {
      console.error('Webhook: no userId or email found in session');
    }
  }

  res.json({ received: true });
});

// ── Gate app.js — only serve full course to paying users ──────
app.get('/app.js', (req, res, next) => {
  const user = getAuthUser(req);
  if (user) {
    // Check Supabase for has_access (async)
    supabase.from('profiles')
      .select('has_access')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.has_access) return next();
        serveAppStub(res);
      })
      .catch(() => serveAppStub(res));
  } else {
    serveAppStub(res);
  }
});

function serveAppStub(res) {
  res.type('application/javascript');
  res.send(`
(function(){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('view--active');});
  var hero = document.getElementById('view-hero');
  if (hero) hero.classList.add('view--active');
})();
function showView(v) {
  if (v !== 'hero') {
    var m = document.getElementById('paywall-modal');
    if (m) m.style.display = 'flex';
    return;
  }
  document.querySelectorAll('.view').forEach(function(el){el.classList.remove('view--active');});
  var hero = document.getElementById('view-hero');
  if (hero) hero.classList.add('view--active');
}
function renderDashboard() {}
function generateCert() {}
  `);
}

// ── PWA Routes ────────────────────────────────────────────────
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, 'sw.js')));
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.json([{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.aimastery.course',
      sha256_cert_fingerprints: ['29:15:86:DC:53:4E:DA:F1:E5:76:80:AC:90:B3:DC:B6:71:A2:B2:A8:D7:4A:96:F8:32:4D:E2:FD:DA:57:27:2A']
    }
  }]);
});

// ── Static + SPA fallback ─────────────────────────────────────
app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Mastery server running on port ${PORT}`);
  if (missing.length) {
    console.warn(`⚠️  Missing env vars: ${missing.join(', ')}`);
  } else {
    console.log('✅ All environment variables present');
  }
});
