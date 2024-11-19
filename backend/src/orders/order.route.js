const express = require('express');
const router = express.Router();
const { createOrder, getOrderUsingEmail } = require('./order.controller')

router.post('/createOrder', createOrder);
router.get('/getOrder/:email', getOrderUsingEmail);

module.exports = router;