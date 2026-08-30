// Runs once per test file (jest `setupFiles`), before server.js is required.
// Dummy values only — real Supabase/Stripe clients are mocked in tests/mocks/.
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_link';
delete process.env.STRIPE_WEBHOOK_SECRET;
