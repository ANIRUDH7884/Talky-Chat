const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const logger = require("../libs/logger");
const getWelcomeEmailTemplate = require("../utils/successRegister");
const getOtpEmailTemplate = require("../utils/otpTemplate");
const { hashPassword } = require("../libs/hasher");
const { sendEmail } = require("../services/Mailer");
const {validateEmail, validatePassword, validatePhoneNumber, validateUsername,} = require("../libs/validator");
const { comparePasswords } = require("../libs/hasher");
const { generateToken } = require('../services/jwtService');

const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

//Create Otp End-Point
const CreateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "email-required",
      message: "Email is required to generate OTP",
    });
  }

  const otpCode = generateOtp();

  try {
    await Otp.deleteMany({ email });

    await Otp.create({ email, otpCode, status: "new" });

    const htmlTemplate = getOtpEmailTemplate(otpCode, "User");
    await sendEmail(email, "Your OTP for Talky Chat", htmlTemplate);

    return res.status(200).json({
      status: "otp-sent",
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    logger.error("OTP Generation Error:", error);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while generating OTP",
    });
  }
};

//Verify Otp Endpoint
const VerifyOtp = async (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Email and OTP code are required",
    });
  }

  try {
    const otpRecord = await Otp.findOne({ email, status: "new" });

    if (!otpRecord) {
      return res.status(400).json({
        status: "otp-not-found",
        message: "OTP not found, expired, or already used",
      });
    }

    logger.info(" OTP Record Found:", otpRecord);

    if (otpRecord.otpCode !== Number(otpCode)) {
      return res.status(400).json({
        status: "otp-invalid",
        message: "Incorrect OTP entered",
      });
    }

    otpRecord.status = "verified";
    await otpRecord.save();

    return res.status(200).json({
      status: "otp-verified",
      message: "OTP verified successfully",
    });
  } catch (error) {
    logger.error("OTP Verification Error:", error);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while verifying OTP",
    });
  }
};

//Register End-point
const registerUser = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({
      status: "missing-fields",
      message: "All fields are required",
    });
  }

  if (!validateUsername(username)) {
    return res.status(400).json({
      status: "invalid-username",
      message:
        "Username must be 3-20 characters long with letters, numbers or underscores only",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      status: "invalid-email",
      message: "Invalid email format",
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      status: "weak-password",
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  if (!validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({
      status: "invalid-phone",
      message: "Phone number must be a valid 10-digit number starting with 6-9",
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "user-exists",
        message: "Email or phone number is already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const welcomeHtml = getWelcomeEmailTemplate(newUser.username);
    await sendEmail(newUser.email, "👋 Welcome to Talky Chat!", welcomeHtml);

    logger.info(`User registered: ${newUser.email}`);

    return res.status(201).json({
      status: "register-success",
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        profilePic: newUser.profilePic,
        status: newUser.status,
      },
    });
  } catch (error) {
    logger.error("User registration error:", error);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong during registration",
    });
  }
};

//Login End-Point
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Both identifier and password are required",
    });
  }

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await User.findOne(
      isEmail ? { email: identifier } : { phoneNumber: identifier }
    );

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found with given email or phone",
      });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "invalid-credentials",
        message: "Incorrect password",
      });
    }

    user.status = "online";
    await user.save();

    const Token = generateToken({UserId:user._id, Email:user.email, User:user.username})
    
    return res.status(200).json({
      status: "login-success",
      message: "Login successful",
      Token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        status: user.status,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong during login",
    });
  }
};

//Update Profile End-Point
const updateProfile = async(req , res) =>{
  const userId = req.auth.id;
  const {username, status, profilePic} = req.body

  if(!username && !status && !profilePic) {
    return res.status(400).json({
      status: 'missing-fields',
      message: 'Provide at least one field to update',
    })
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(username && {username}),
          ...(status && {status}),
          ...(profilePic && {profilePic}),
        },
      },
      {new: true}
    ).select('-password');

    return res.status(200).json({
      status: "profile-updated",
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    logger.error("Profile update error:", error);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while updating the profile",
    });
  }
};
 
module.exports = { CreateOtp, VerifyOtp, registerUser, loginUser, updateProfile };
