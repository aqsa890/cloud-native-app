const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_PAYMENT_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PAYMENT_PORT || '5433', 10),
  database: process.env.POSTGRES_PAYMENT_DB || 'payment_db',
  user: process.env.POSTGRES_PAYMENT_USER || 'postgres',
  password: process.env.POSTGRES_PAYMENT_PASSWORD || 'postgres',
  connectionTimeoutMillis: 3000,
});

let isDbAvailable = false;

// Attempt table initialization
const initDb = async () => {
  try {
    const client = await pool.connect();
    isDbAvailable = true;
    console.log('✅ Payment Service connected to PostgreSQL!');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    client.release();
    console.log('💳 Payments table initialized in PostgreSQL.');
  } catch (err) {
    console.warn(`⚠️ Payment Service PostgreSQL unavailable (${err.message}). Using in-memory store.`);
    isDbAvailable = false;
  }
};

initDb();

module.exports = {
  pool,
  isDbConnected: () => isDbAvailable
};
