const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages } = require('../controllers/messageController')
const verifyToken = require('../middleware/VerifyToken');

router.post('/send', verifyToken, sendMessage);
router.get('/:chatId', verifyToken, getAllMessages);

module.exports = router;