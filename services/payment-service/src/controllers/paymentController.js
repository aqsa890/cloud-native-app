const PaymentService = require('../services/paymentService');

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { user_id, product_id, amount, userId, productId } = req.body;
      const targetUser = user_id || userId;
      const targetProduct = product_id || productId;

      const result = await PaymentService.processPayment({
        userId: targetUser,
        productId: targetProduct,
        amount: amount,
      });

      const statusCode = result.transaction.status === 'failed' ? 400 : 201;
      res.status(statusCode).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getPayment(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ error: `Payment record #${id} not found` });
      }
      res.status(200).json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserPayments(req, res) {
    try {
      const { userId } = req.params;
      const payments = await PaymentService.getPaymentsByUser(userId);
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PaymentController;
