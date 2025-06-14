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

    await Otp.create({ email, otpCode });

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

module.exports = { CreateOtp };
