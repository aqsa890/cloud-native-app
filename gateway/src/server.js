const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const proxyRoutes = require('./routes/proxyRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    routedServices: config.services
  });
});

// Proxy Routes
app.use(proxyRoutes);

// Fallback 404 Route
app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.path}. Ensure path starts with /api/auth, /api/products, or /api/payments`
  });
});

app.listen(config.port, () => {
  console.log(`=================================`);
  console.log(`🚀 API Gateway running on port ${config.port}`);
  console.log(`🔗 Auth Target: ${config.services.auth}`);
  console.log(`🔗 Product Target: ${config.services.product}`);
  console.log(`🔗 Payment Target: ${config.services.payment}`);
  console.log(`=================================`);
});
