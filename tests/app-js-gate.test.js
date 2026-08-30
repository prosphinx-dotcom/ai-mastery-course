// GET /app.js — this is a paywall gate, not a static file route (server.js
// intercepts it ahead of express.static). It must fail closed to the no-op
// stub for anyone who isn't authenticated *and* paid, since the real course
// logic in app.js is otherwise fully readable by anyone signed in.

jest.mock('@supabase/supabase-js', () => require('./mocks/supabase'));
jest.mock('stripe', () => require('./mocks/stripe'));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { __mock: supabaseMock } = require('@supabase/supabase-js');

let app;
beforeAll(() => {
  app = require('../server');
});

beforeEach(() => {
  supabaseMock.reset();
});

const STUB_MARKER = 'function renderDashboard(){}';

function tokenFor(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
}

test('no auth cookie: serves the stub', async () => {
  const res = await request(app).get('/app.js');

  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toMatch(/javascript/);
  expect(res.text).toContain(STUB_MARKER);
  expect(supabaseMock.calls()).toHaveLength(0);
});

test('invalid/tampered token: serves the stub, never throws', async () => {
  const res = await request(app).get('/app.js').set('Cookie', 'aim_token=not-a-real-jwt');

  expect(res.status).toBe(200);
  expect(res.text).toContain(STUB_MARKER);
});

test('authenticated but has_access is false: serves the stub', async () => {
  supabaseMock.queue('profiles', { data: { has_access: false } });
  const token = tokenFor({ id: 'user-1', email: 'a@b.com' });

  const res = await request(app).get('/app.js').set('Cookie', `aim_token=${token}`);

  expect(res.status).toBe(200);
  expect(res.text).toContain(STUB_MARKER);
});

test('authenticated with has_access true: serves the real app.js, not the stub', async () => {
  supabaseMock.queue('profiles', { data: { has_access: true } });
  const token = tokenFor({ id: 'user-1', email: 'a@b.com' });

  const res = await request(app).get('/app.js').set('Cookie', `aim_token=${token}`);

  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toMatch(/javascript/);
  expect(res.text).not.toContain(STUB_MARKER);
  expect(res.text.length).toBeGreaterThan(1000); // real course content, not the tiny stub
});

test('a Supabase lookup failure fails closed to the stub, not a crash or the real script', async () => {
  supabaseMock.queue('profiles', new Error('connection reset'));
  const token = tokenFor({ id: 'user-1', email: 'a@b.com' });

  const res = await request(app).get('/app.js').set('Cookie', `aim_token=${token}`);

  expect(res.status).toBe(200);
  expect(res.text).toContain(STUB_MARKER);
});
