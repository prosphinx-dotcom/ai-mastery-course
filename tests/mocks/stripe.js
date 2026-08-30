// Mock for the `stripe` package, wired in via jest.mock() in test files.
// server.js calls `require('stripe')(secretKey)` once at module load — this
// factory always returns the same instance so tests can reconfigure
// `webhooks.constructEvent` per-case after server.js has already required it.

const instance = {
  webhooks: {
    constructEvent: jest.fn(),
  },
};

const factory = jest.fn(() => instance);
factory.__instance = instance;

module.exports = factory;
