// /api/auth/{register,login,logout,me} — covers validation, the
// register/login credential paths, and the requireAuth cookie/JWT guard.

jest.mock('@supabase/supabase-js', () => require('./mocks/supabase'));
jest.mock('stripe', () => require('./mocks/stripe'));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { __mock: supabaseMock } = require('@supabase/supabase-js');

let app;
beforeAll(() => {
  app = require('../server');
});

beforeEach(() => {
  supabaseMock.reset();
});

function tokenFor(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
}

describe('POST /api/auth/register', () => {
  test('missing email or password: 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test('password under 8 chars: 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/8 characters/i);
  });

  test('duplicate email: 400, no insert attempted', async () => {
    supabaseMock.queue('profiles', { data: { id: 'existing-user' } }); // the pre-existence check

    const res = await request(app).post('/api/auth/register').send({ email: 'dupe@b.com', password: 'password1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
    const insertCall = supabaseMock.calls().find((c) => c.ops.some((op) => op[0] === 'insert'));
    expect(insertCall).toBeUndefined();
  });

  test('success: creates profile + stats row, sets aim_token cookie', async () => {
    supabaseMock.queue('profiles', { data: null, error: null }); // no existing account
    supabaseMock.queue('profiles', { data: { id: 'new-user', email: 'new@b.com', has_access: false }, error: null }); // insert
    supabaseMock.queue('user_stats', { data: {}, error: null }); // stats row insert

    const res = await request(app).post('/api/auth/register').send({ email: 'New@B.com', password: 'password1' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, user: { id: 'new-user', email: 'new@b.com', has_access: false } });
    expect(res.headers['set-cookie'][0]).toMatch(/^aim_token=/);

    const profileInsert = supabaseMock.calls().find((c) => c.table === 'profiles' && c.ops.some((op) => op[0] === 'insert'));
    expect(profileInsert.ops[0]).toEqual(['insert', { email: 'new@b.com', password_hash: expect.any(String) }]);
  });

  test('insert failure surfaces the Supabase error message with 500', async () => {
    supabaseMock.queue('profiles', { data: null, error: null });
    supabaseMock.queue('profiles', { data: null, error: { message: 'unique constraint violated' } });

    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'password1' });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('unique constraint violated');
  });
});

describe('POST /api/auth/login', () => {
  test('missing email or password: 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  test('unknown email: 401 generic error (no user enumeration)', async () => {
    supabaseMock.queue('profiles', { data: null, error: null });

    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@b.com', password: 'password1' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });

  test('wrong password: 401', async () => {
    const password_hash = await bcrypt.hash('correct-password', 12);
    supabaseMock.queue('profiles', { data: { id: 'u1', email: 'a@b.com', password_hash, has_access: false }, error: null });

    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });

  test('correct credentials: 200, sets cookie, returns has_access', async () => {
    const password_hash = await bcrypt.hash('correct-password', 12);
    supabaseMock.queue('profiles', { data: { id: 'u1', email: 'a@b.com', password_hash, has_access: true }, error: null });

    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'correct-password' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, user: { id: 'u1', email: 'a@b.com', has_access: true } });
    expect(res.headers['set-cookie'][0]).toMatch(/^aim_token=/);
  });
});

test('POST /api/auth/logout clears the aim_token cookie', async () => {
  const res = await request(app).post('/api/auth/logout');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(res.headers['set-cookie'][0]).toMatch(/^aim_token=;/);
});

describe('GET /api/auth/me', () => {
  test('no cookie: 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/not authenticated/i);
  });

  test('invalid/expired token: 401 session-expired message', async () => {
    const badToken = jwt.sign({ id: 'u1' }, 'wrong-secret', { expiresIn: '30d' });
    const res = await request(app).get('/api/auth/me').set('Cookie', `aim_token=${badToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/session expired/i);
  });

  test('Authorization: Bearer header works as an alternative to the cookie', async () => {
    supabaseMock.queue('profiles', { data: { id: 'u1', email: 'a@b.com', has_access: true, created_at: 't' } });
    supabaseMock.queue('user_stats', { data: { xp: 5, streak: 1, last_activity: 't' } });

    const token = tokenFor({ id: 'u1', email: 'a@b.com' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe('u1');
  });

  test('valid token, profile not found: 404', async () => {
    supabaseMock.queue('profiles', { data: null });
    supabaseMock.queue('user_stats', { data: null });

    const token = tokenFor({ id: 'ghost', email: 'ghost@b.com' });
    const res = await request(app).get('/api/auth/me').set('Cookie', `aim_token=${token}`);

    expect(res.status).toBe(404);
  });

  test('valid token, profile found, no stats row yet: defaults stats to xp/streak 0', async () => {
    supabaseMock.queue('profiles', { data: { id: 'u1', email: 'a@b.com', has_access: true, created_at: 't' } });
    supabaseMock.queue('user_stats', { data: null });

    const token = tokenFor({ id: 'u1', email: 'a@b.com' });
    const res = await request(app).get('/api/auth/me').set('Cookie', `aim_token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toEqual({ xp: 0, streak: 0 });
  });
});
