const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Payment Service (Node.js/Express)',
    port: PORT,
  });
});

// Routes
app.use('/payments', paymentRoutes);

// Fallback error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found in Payment Service' });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`💳 Payment Service running on port ${PORT}`);
  console.log(`=================================`);
});
