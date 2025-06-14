const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otpCode: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
  status: {
    type: String,
    enum: ["new", "verified", "used", "expired"],
    default: "new",
  },
});

module.exports = mongoose.model("Otp", otpSchema);
