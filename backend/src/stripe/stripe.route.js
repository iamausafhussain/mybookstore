const express = require('express');
const { createCheckSession } = require('./stripe.controller');
const router = express.Router();

router.post("/create-checkout-session", createCheckSession)

module.exports = router;