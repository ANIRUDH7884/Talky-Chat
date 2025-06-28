const express = require('express');
const router = express.Router();
const { accessChat } = require('../controllers/chatController');
const verifyToken = require('../middleware/verifyToken');

router.post('/access-chat', verifyToken, accessChat);

module.exports = router;
