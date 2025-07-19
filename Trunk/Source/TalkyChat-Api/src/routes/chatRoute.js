const express = require('express');
const router = express.Router();
const { accessChat, getAllChats} = require('../controllers/chatController');
const verifyToken = require('../middleware/VerifyToken');

router.post('/access-chat', verifyToken, accessChat);
router.get('/', verifyToken, getAllChats);

module.exports = router;
