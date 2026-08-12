const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/env');

const router = express.Router();

// Auth Service Proxy (/api/auth/*)
router.use('/api/auth', proxy(config.services.auth, {
  proxyReqPathResolver: (req) => {
    return `/api/auth${req.url}`;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Auth Service Error:', err.message);
    res.status(503).json({
      error: 'Auth Service Unavailable',
      message: 'Failed to connect to authentication microservice',
    });
  }
}));

// Product Service Proxy (/api/products/*)
router.use('/api/products', proxy(config.services.product, {
  proxyReqPathResolver: (req) => {
    return `/products${req.url}`;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Product Service Error:', err.message);
    res.status(503).json({
      error: 'Product Service Unavailable',
      message: 'Failed to connect to product microservice',
    });
  }
}));

// Payment Service Proxy (/api/payments/*)
router.use('/api/payments', proxy(config.services.payment, {
  proxyReqPathResolver: (req) => {
    return `/payments${req.url}`;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Payment Service Error:', err.message);
    res.status(503).json({
      error: 'Payment Service Unavailable',
      message: 'Failed to connect to payment microservice',
    });
  }
}));

module.exports = router;
