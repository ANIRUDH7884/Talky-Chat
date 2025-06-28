const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController')
const verifyToken = require('../middleware/VerifyToken');

router.post('/send', verifyToken, sendMessage);

module.exports = router;