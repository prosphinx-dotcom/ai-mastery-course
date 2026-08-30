// POST /webhook — the Stripe webhook is the sole source of truth for granting
// paid access (server.js flips profiles.has_access here). Covers signature
// verification, both id/email match paths, and the unverified-JSON fallback
// used when STRIPE_WEBHOOK_SECRET isn't set.

jest.mock('@supabase/supabase-js', () => require('./mocks/supabase'));
jest.mock('stripe', () => require('./mocks/stripe'));

const request = require('supertest');
const { __mock: supabaseMock } = require('@supabase/supabase-js');
const stripeFactory = require('stripe');

let app;
beforeAll(() => {
  app = require('../server');
});

beforeEach(() => {
  supabaseMock.reset();
});

function checkoutCompletedEvent(overrides = {}) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        client_reference_id: 'user-123',
        customer_details: { email: 'buyer@example.com' },
        payment_intent: 'pi_abc',
        ...overrides,
      },
    },
  };
}

describe('POST /webhook — signature verified (STRIPE_WEBHOOK_SECRET set)', () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  });

  test('invalid signature is rejected with 400 and grants nothing', async () => {
    stripeFactory.__instance.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('signature mismatch');
    });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'bad-sig')
      .send(JSON.stringify(checkoutCompletedEvent()));

    expect(res.status).toBe(400);
    expect(res.text).toContain('Webhook Error');
    expect(supabaseMock.calls()).toHaveLength(0);
  });

  test('event type other than checkout.session.completed is a no-op', async () => {
    stripeFactory.__instance.webhooks.constructEvent.mockReturnValue({ type: 'payment_intent.created', data: { object: {} } });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'good-sig')
      .send(JSON.stringify({}));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });
    expect(supabaseMock.calls()).toHaveLength(0);
  });

  test('grants access by client_reference_id when present', async () => {
    stripeFactory.__instance.webhooks.constructEvent.mockReturnValue(checkoutCompletedEvent());
    supabaseMock.queue('profiles', { error: null });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'good-sig')
      .send(JSON.stringify(checkoutCompletedEvent()));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });

    const call = supabaseMock.calls().find((c) => c.table === 'profiles');
    expect(call).toBeDefined();
    expect(call.ops).toContainEqual(['update', { has_access: true, stripe_payment_id: 'pi_abc' }]);
    expect(call.ops).toContainEqual(['eq', 'id', 'user-123']);
  });

  test('falls back to matching by lowercased email when client_reference_id is missing', async () => {
    const event = checkoutCompletedEvent({ client_reference_id: null, customer_details: { email: 'Buyer@Example.com' } });
    stripeFactory.__instance.webhooks.constructEvent.mockReturnValue(event);
    supabaseMock.queue('profiles', { error: null });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'good-sig')
      .send(JSON.stringify(event));

    expect(res.status).toBe(200);
    const call = supabaseMock.calls().find((c) => c.table === 'profiles');
    expect(call.ops).toContainEqual(['eq', 'email', 'buyer@example.com']);
  });

  test('no client_reference_id and no email: nothing is updated, still acks 200', async () => {
    const event = checkoutCompletedEvent({ client_reference_id: null, customer_details: null });
    stripeFactory.__instance.webhooks.constructEvent.mockReturnValue(event);

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'good-sig')
      .send(JSON.stringify(event));

    expect(res.status).toBe(200);
    expect(supabaseMock.calls()).toHaveLength(0);
  });

  test('a Supabase update error still acks 200 (webhook must not retry-storm Stripe)', async () => {
    stripeFactory.__instance.webhooks.constructEvent.mockReturnValue(checkoutCompletedEvent());
    supabaseMock.queue('profiles', { error: { message: 'db unavailable' } });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'good-sig')
      .send(JSON.stringify(checkoutCompletedEvent()));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });
  });
});

describe('POST /webhook — STRIPE_WEBHOOK_SECRET unset (unverified fallback)', () => {
  beforeEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  test('parses the body as JSON without checking the signature', async () => {
    supabaseMock.queue('profiles', { error: null });

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(checkoutCompletedEvent()));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });
    const call = supabaseMock.calls().find((c) => c.table === 'profiles');
    expect(call.ops).toContainEqual(['eq', 'id', 'user-123']);
  });

  test('malformed JSON body is rejected with 400', async () => {
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send('{not valid json');

    expect(res.status).toBe(400);
    expect(res.text).toContain('Webhook Error');
  });
});
