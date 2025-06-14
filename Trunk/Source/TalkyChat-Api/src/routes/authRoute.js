const express = require('express');
const router = express.Router();

const{ CreateOtp, VerifyOtp } = require('../controllers/authController')

//End-Points 
router.post('/Create-Otp' ,CreateOtp );
router.post('/Verify-Otp' ,VerifyOtp );

module.exports = router;