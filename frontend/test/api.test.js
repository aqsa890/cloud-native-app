import test from 'node:test';
import assert from 'node:assert/strict';

test('Frontend Config - API Gateway target URL', () => {
  const gatewayUrl = process.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';
  assert.equal(gatewayUrl, 'http://localhost:8000');
});
