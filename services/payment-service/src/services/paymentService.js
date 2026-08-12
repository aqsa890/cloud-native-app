const PaymentModel = require('../models/paymentModel');

class PaymentService {
  static async processPayment({ userId, productId, amount }) {
    if (!userId || !productId || !amount) {
      throw new Error('userId, productId, and amount are required');
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Simulated business logic: payment is successful unless amount is 999 (simulated decline)
    let status = 'success';
    if (numericAmount === 999) {
      status = 'failed';
    } else if (numericAmount > 1000) {
      status = 'pending';
    }

    const record = await PaymentModel.create({
      userId: parseInt(userId, 10),
      productId: parseInt(productId, 10),
      amount: numericAmount,
      status: status,
    });

    return {
      message: status === 'success' ? 'Payment processed successfully' : `Payment status: ${status}`,
      transaction: record,
    };
  }

  static async getPaymentById(id) {
    return await PaymentModel.findById(id);
  }

  static async getPaymentsByUser(userId) {
    return await PaymentModel.findByUserId(userId);
  }
}

module.exports = PaymentService;
