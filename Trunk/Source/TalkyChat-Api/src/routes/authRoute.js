const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken');
const upload = require('../utils/multer');
const uploadErrorHandler = require('../middleware/uploadErrorHandler')
const{ CreateOtp, VerifyOtp, registerUser, loginUser, updateProfile, changePassword, getMyProfile, logout, deleteAccount, forgotPassword, verifyResetOtp, resendResetOtp, resetPassword } = require('../controllers/authController')

//End-Points 
router.post('/Create-Otp' ,CreateOtp );
router.post('/Verify-Otp' ,VerifyOtp );
router.post('/Register' ,registerUser );
router.post('/forgot-password' ,forgotPassword);
router.post('/verifyReset-Otp' ,verifyResetOtp);
router.post('/reset-password' ,resetPassword);
router.post('/resend-Otp' ,resendResetOtp);
router.post('/Login' ,loginUser );
router.put('/Profile' ,verifyToken,upload.single('profilePic'),uploadErrorHandler, updateProfile);
router.put('/Change-password' ,verifyToken, changePassword);
router.get('/Get-Profile', verifyToken, getMyProfile);
router.post('/Logout', verifyToken, logout);
router.delete('/Delete', verifyToken, deleteAccount);

module.exports = router;
