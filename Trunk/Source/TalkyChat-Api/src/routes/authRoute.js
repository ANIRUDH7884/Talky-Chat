const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken');
const upload = require('../utils/multer');
const uploadErrorHandler = require('../middleware/uploadErrorHandler')

const{ CreateOtp, VerifyOtp, registerUser, loginUser, updateProfile } = require('../controllers/authController')

//End-Points 
router.post('/Create-Otp' ,CreateOtp );
router.post('/Verify-Otp' ,VerifyOtp );
router.post('/Register' ,registerUser );
router.post('/Login' ,loginUser );
router.put('/Profile' ,verifyToken,upload.single('profilePic'),uploadErrorHandler, updateProfile);

module.exports = router;