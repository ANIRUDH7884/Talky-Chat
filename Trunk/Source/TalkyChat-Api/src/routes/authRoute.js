const express = require('express');
const router = express.Router();

const{ CreateOtp, VerifyOtp, registerUser } = require('../controllers/authController')

//End-Points 
router.post('/Create-Otp' ,CreateOtp );
router.post('/Verify-Otp' ,VerifyOtp );
router.post('/Register' ,registerUser );

module.exports = router;