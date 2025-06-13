const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
        },
        
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },
        
        password: {
            type: String,
            required: [true, "Password is Required"],
            minlength: [8, "Password must be atleast 8 Charachters"]
        },

        profilePic: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ['online', 'offline'],
            default: "offline",
        },
        phoneNumber: {
            type: Number,
            unique: true
        }
    },
    { timestamp : true }
);

module.exports = mongoose.model("user" , userSchema);