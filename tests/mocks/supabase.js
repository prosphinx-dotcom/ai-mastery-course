// Mock for `@supabase/supabase-js`, wired in via jest.mock() in test files.
//
// Mimics the query-builder chain server.js relies on: `.from(table)` returns a
// thenable builder whose chain methods (select/eq/insert/update/upsert/...)
// just record what was called and return the builder itself, so both
// `await supabase.from(x).select().eq()` (no terminal call) and
// `await supabase.from(x).select().eq().single()` resolve correctly.
//
// Tests drive responses with `queue(table, response)` — one entry per
// `.from(table)` call, consumed FIFO. Queueing an Error rejects instead of
// resolving, for simulating a Supabase call throwing/erroring.
// `calls()` exposes every `.from()` invocation (table + ops) for assertions.

const state = { queues: {}, calls: [] };

function reset() {
  state.queues = {};
  state.calls = [];
}

function queue(table, response) {
  state.queues[table] = state.queues[table] || [];
  state.queues[table].push(response);
}

function resolveNext(table) {
  const q = state.queues[table];
  const next = q && q.length ? q.shift() : { data: null, error: null };
  if (next instanceof Error) return Promise.reject(next);
  return Promise.resolve(next);
}

const CHAIN_METHODS = ['select', 'insert', 'update', 'upsert', 'eq', 'neq', 'gt', 'lt', 'order', 'limit', 'delete'];

function makeBuilder(table) {
  const record = { table, ops: [] };
  const builder = {};
  CHAIN_METHODS.forEach((method) => {
    builder[method] = (...args) => {
      record.ops.push([method, ...args]);
      return builder;
    };
  });
  builder.single = () => {
    record.ops.push(['single']);
    state.calls.push(record);
    return resolveNext(table);
  };
  builder.maybeSingle = () => {
    record.ops.push(['maybeSingle']);
    state.calls.push(record);
    return resolveNext(table);
  };
  // Thenable: lets code `await` the builder directly without a terminal call.
  builder.then = (resolve, reject) => {
    state.calls.push(record);
    return resolveNext(table).then(resolve, reject);
  };
  return builder;
}

const client = { from: (table) => makeBuilder(table) };

module.exports = {
  createClient: () => client,
  __mock: { queue, reset, calls: () => state.calls },
};
