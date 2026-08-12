const { pool, isDbConnected } = require('../config/db');

// In-memory array fallback
const inMemoryPayments = [];
let nextId = 1;

class PaymentModel {
  static async create({ userId, productId, amount, status = 'success' }) {
    if (isDbConnected()) {
      try {
        const query = `
          INSERT INTO payments (user_id, product_id, amount, status)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
        const values = [userId, productId, amount, status];
        const res = await pool.query(query, values);
        return res.rows[0];
      } catch (err) {
        console.error('DB Insert Error, falling back to in-memory:', err.message);
      }
    }

    // In-memory fallback
    const payment = {
      id: nextId++,
      user_id: userId,
      product_id: productId,
      amount: parseFloat(amount),
      status: status,
      created_at: new Date().toISOString(),
    };
    inMemoryPayments.push(payment);
    return payment;
  }

  static async findById(id) {
    if (isDbConnected()) {
      try {
        const res = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.error('DB Query Error:', err.message);
      }
    }
    return inMemoryPayments.find((p) => p.id === parseInt(id, 10)) || null;
  }

  static async findByUserId(userId) {
    if (isDbConnected()) {
      try {
        const res = await pool.query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return res.rows;
      } catch (err) {
        console.error('DB Query Error:', err.message);
      }
    }
    return inMemoryPayments.filter((p) => p.user_id === parseInt(userId, 10));
  }
}

module.exports = PaymentModel;
