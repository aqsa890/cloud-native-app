const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../src/config/env');

test('Gateway Config - default port and services', () => {
  assert.ok(config.port);
  assert.equal(config.services.auth, 'http://localhost:8001');
  assert.equal(config.services.product, 'http://localhost:8002');
  assert.equal(config.services.payment, 'http://localhost:8003');
});
