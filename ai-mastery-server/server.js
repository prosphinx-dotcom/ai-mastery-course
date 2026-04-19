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

// Stripe webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

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

// ── Database Setup ────────────────────────────────────────────
async function setupDatabase() {
  // Create tables if they don't exist
  const queries = [
    `CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      has_access BOOLEAN DEFAULT FALSE,
      stripe_payment_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS public.user_stats (
      user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      last_activity DATE
    )`,
    `CREATE TABLE IF NOT EXISTS public.progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      lesson_day INTEGER NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0,
      completed_at TIMESTAMPTZ,
      UNIQUE(user_id, lesson_day)
    )`
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec', { sql: query }).catch(() => ({ error: null }));
    // Tables may already exist — ignore errors
  }
  console.log('Database ready');
}

// ── Auth Routes ───────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('profiles')
      .insert({ email: email.toLowerCase(), password_hash })
      .select()
      .single();

    if (error) throw error;

    // Create stats row
    await supabase.from('user_stats').insert({ user_id: user.id });

    // Issue JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('aim_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.json({ success: true, user: { id: user.id, email: user.email, has_access: user.has_access } });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
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

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('aim_token');
  res.json({ success: true });
});

// Get current user
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

// Get all progress
app.get('/api/progress', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', req.user.id);
  res.json(data || []);
});

// Save lesson progress
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

    // Update XP and streak
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

// Create checkout session
app.post('/api/checkout', requireAuth, async (req, res) => {
  const paymentLink = process.env.STRIPE_PAYMENT_LINK;

  // Append user id so webhook can activate account after payment
  const url = `${paymentLink}?client_reference_id=${req.user.id}`;
  res.json({ url });
});

// Stripe webhook — auto-activates account on payment
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (e) {
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const paymentId = session.payment_intent || session.id;

    if (userId) {
      await supabase.from('profiles').update({
        has_access: true,
        stripe_payment_id: paymentId
      }).eq('id', userId);
      console.log(`Access granted to user: ${userId}`);
    }
  }

  res.json({ received: true });
});

// ── PWA / App Routes ──────────────────────────────────────────
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, 'sw.js')));
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.json([{ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: 'com.aimastery.course', sha256_cert_fingerprints: ['29:15:86:DC:53:4E:DA:F1:E5:76:80:AC:90:B3:DC:B6:71:A2:B2:A8:D7:4A:96:F8:32:4D:E2:FD:DA:57:27:2A'] } }]);
});

// Catch-all — serve index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`AI Mastery server running on port ${PORT}`);
  await setupDatabase();
});
