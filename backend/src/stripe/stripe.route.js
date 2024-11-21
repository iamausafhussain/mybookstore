const express = require('express');
const { createCheckSession, retriveSession, webhookSession } = require('./stripe.controller');
const router = express.Router();

router.post("/create-checkout-session", createCheckSession)
router.post("/webhook", express.json({type: 'application/json'}), webhookSession)
router.get("/retrieve-session/:sessionId", retriveSession)

module.exports = router;