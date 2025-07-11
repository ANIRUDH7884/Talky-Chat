const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const logger = require("../libs/logger");
const getWelcomeEmailTemplate = require("../utils/successRegister");
const getForgotPasswordTemplate = require("../utils/forgotPasswordTemplate");
const getOtpEmailTemplate = require("../utils/otpTemplate");
const { hashPassword } = require("../libs/hasher");
const { sendEmail } = require("../services/Mailer");
const {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUsername,
} = require("../libs/validator");
const { comparePasswords } = require("../libs/hasher");
const {
  generateToken,
  generateRefreshToken,
  generateResetToken,
  verifyResetToken
} = require("../services/jwtService");

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

    const otpRecord = await Otp.findOne({ email, status: "verified" });

    if (!otpRecord) {
      return res.status(400).json({
        status: "otp-not-verified",
        message: "Please verify your email OTP before registering",
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

    otpRecord.status = "used";
    await otpRecord.save();

    await Otp.deleteMany({ email });

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

    const accessToken = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
      username: user.username,
    });

    return res.status(200).json({
      status: "login-success",
      message: "Login successful",
      accessToken,
      refreshToken,
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
const updateProfile = async (req, res) => {
  const userId = req.auth.id;
  const { username, status } = req.body;
  const profilePic = req.file ? req.file.path : null;

  if (!username && !status && !profilePic) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Provide at least one field to update",
    });
  }

  try {
    logger.info(`Updating profile for user: ${userId}`);
    if (req.file) {
      logger.info("Profile picture uploaded to Cloudinary:", req.file.path);
    }

    const updateData = {
      ...(username && { username }),
      ...(status && { status }),
      ...(profilePic && { profilePic }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "profile-updated",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Profile update error:", JSON.stringify(error, null, 2));
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while updating the profile",
      error: error?.message || "Unknown error",
    });
  }
};

//change Password End-point
const changePassword = async (req, res) => {
  const userId = req.auth.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Both current and new passwords are required",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found",
      });
    }

    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "invalid-password",
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      status: "password-updated",
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while changing the password",
    });
  }
};

// Forgot Password Endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "email-required",
      message: "Email is required to reset password",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "No account found with this email",
      });
    }

    await Otp.deleteMany({ email });

    const otpCode = generateOtp();
    await Otp.create({ email, otpCode, status: "new" });

    const htmlTemplate = getForgotPasswordTemplate(otpCode, user.username);
    await sendEmail(email, "OTP for Password Reset - Talky Chat", htmlTemplate);

    return res.status(200).json({
      status: "otp-sent",
      message: "OTP sent to your email for password reset",
    });
  } catch (error) {
    logger.error("Forgot Password Error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while requesting password reset",
    });
  }
};

//Reset Password Endpoint
const resetPassword = async (req, res) => {
  const { token, email, newPassword, confirmPassword } = req.body; 

  if (!token || !email) {
    return res.status(400).json({
      status: "missing-token-or-email",
      message: "Reset token and email are required",
    });
  }

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Both new password and confirm password are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "password-mismatch",
      message: "Passwords do not match",
    });
  }

  try {
    const decoded = verifyResetToken(token);

    if (!decoded || !decoded.id || decoded.email !== email) {
      return res.status(401).json({
        status: "invalid-token",
        message: "Invalid or expired reset token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "password-reset",
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Reset password error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while resetting password",
    });
  }
};

//Verify ResetOtp Endpoint
const verifyResetOtp = async (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({
      status: "missing-fields",
      message: "Email and OTP are required",
    });
  }

  try {
    const otpRecord = await Otp.findOne({ email, status: "new" });

    if (!otpRecord) {
      return res.status(404).json({
        status: "otp-not-found",
        message: "OTP not found or already used",
      });
    }

    if (otpRecord.otpCode !== Number(otpCode)) {
      return res.status(400).json({
        status: "invalid-otp",
        message: "Incorrect OTP entered",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User does not exist",
      });
    }

    otpRecord.status = "verified";
    await otpRecord.save();

    const resetToken = generateResetToken({
      id: user._id,
      email: user.email,
    });

    return res.status(200).json({
      status: "otp-verified",
      message: "OTP verified successfully for password reset",
      token: resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while verifying reset OTP",
    });
  }
};

//Resend Otp Endpoint
const resendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "email-required",
      message: "Email is required to resend OTP",
    });
  }

  try {
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    await Otp.deleteMany({ email });

    await Otp.create({ email, otpCode, status: "new" });

    const htmlTemplate = getOtpEmailTemplate(otpCode, "User");
    await sendEmail(email, "Your Reset OTP for Talky Chat", htmlTemplate);

    return res.status(200).json({
      status: "otp-resent",
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while resending OTP",
    });
  }
};

//refresh Token End Point
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Refresh token missing",
    });
  }

  const decoded = jwtService.verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({
      status: "invalid-token",
      message: "Refresh token invalid or expired",
    });
  }

  const newAccessToken = jwtService.generateAccessToken({
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
  });

  return res.status(200).json({
    status: "token-refreshed",
    message: "Access token refreshed successfully",
    accessToken: newAccessToken,
  });
};

//Logout End-point
const logout = async (req, res) => {
  const userId = req.auth.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: "user-not-found",
        message: "User not found",
      });
    }

    user.status = "offline";
    await user.save();

    return res.status(200).json({
      status: "logout-success",
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Logout error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong during logout",
    });
  }
};

//My Profile End-point
const getMyProfile = async (req, res) => {
  const userId = req.auth.id;

  try {
    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    logger.error("Get my profile error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while fetching profile",
    });
  }
};

//Delete Endpoint
const deleteAccount = async (req, res) => {
  const userId = req.auth.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: "user-not-found",
        message: "User not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "account-deleted",
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error("Delete account error:", error.message);
    return res.status(500).json({
      status: "server-error",
      message: "Something went wrong while deleting the account",
    });
  }
};

module.exports = {
  CreateOtp,
  VerifyOtp,
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  refreshAccessToken,
  getMyProfile,
  logout,
  deleteAccount,
  forgotPassword,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
};
