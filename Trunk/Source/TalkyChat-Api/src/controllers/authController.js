const Otp = require("../models/otpModel");
const logger = require("../libs/logger");
const { sendEmail } = require("../services/Mailer");
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

module.exports = { CreateOtp, VerifyOtp };
