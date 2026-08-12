const test = require('node:test');
const assert = require('node:assert/strict');
const PaymentService = require('../src/services/paymentService');

test('PaymentService - process valid payment', async () => {
  const result = await PaymentService.processPayment({
    userId: 1,
    productId: 2,
    amount: 49.99
  });

  assert.equal(result.transaction.status, 'success');
  assert.equal(result.transaction.user_id, 1);
  assert.equal(result.transaction.product_id, 2);
  assert.equal(result.transaction.amount, 49.99);
  assert.ok(result.transaction.id);
});

test('PaymentService - process payment decline simulation', async () => {
  const result = await PaymentService.processPayment({
    userId: 1,
    productId: 2,
    amount: 999
  });

  assert.equal(result.transaction.status, 'failed');
});

test('PaymentService - invalid inputs throw error', async () => {
  await assert.rejects(
    async () => {
      await PaymentService.processPayment({ userId: null, productId: 1, amount: 10 });
    },
    { message: 'userId, productId, and amount are required' }
  );
});
