const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },

    profilePic: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'busy'],
      default: "offline",
    },

    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      trim: true,
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);
