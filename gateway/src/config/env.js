require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:8002',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8003',
  },
};
