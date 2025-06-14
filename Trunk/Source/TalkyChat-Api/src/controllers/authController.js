const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const logger = require("../libs/logger");
const { hashPassword } = require('../libs/hasher');
const { sendEmail } = require("../services/Mailer");
const getWelcomeEmailTemplate = require('../utils/successRegister');
const getOtpEmailTemplate = require("../utils/otpTemplate");

const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

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
      message:
        "All fields (username, email, password, phoneNumber) are required",
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

    const hashedPassword = await hashPassword(password, 10);

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


module.exports = { CreateOtp, VerifyOtp, registerUser };
