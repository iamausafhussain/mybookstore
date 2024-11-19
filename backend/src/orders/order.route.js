const express = require('express');
const router = express.Router();
const { createOrder } = require('./order.controller')

router.post('/createOrder', createOrder);

module.exports = router;