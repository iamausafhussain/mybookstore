const express = require('express')
const router = express.Router();
const { createUser, getAllUsers, getUser } = require('./user.controller')

router.post('/createUser', createUser)
router.get('/getAllUsers', getAllUsers)
router.get('/getUser/:email', getUser)

module.exports = router;