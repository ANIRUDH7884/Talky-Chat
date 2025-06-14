const express = require('express');
const router = express.Router();

const{ CreateOtp } = require('../controllers/authController')

//End-Points 
router.post('/Create-Otp' ,CreateOtp )

module.exports = router;