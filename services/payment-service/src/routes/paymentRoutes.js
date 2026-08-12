const express = require('express');
const PaymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/', PaymentController.createPayment);
router.get('/:id', PaymentController.getPayment);
router.get('/user/:userId', PaymentController.getUserPayments);

module.exports = router;
