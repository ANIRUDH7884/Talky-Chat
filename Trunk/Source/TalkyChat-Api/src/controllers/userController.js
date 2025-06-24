const logger = require('../libs/logger');
const User = require('../models/userModel');
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = {
      username: { $regex: search, $options: "i" }
    };

    const users = await User.find(query)
      .select("-password -__v")
      .sort({ createdAt: -1 });

    logger.info(`Search query: "${search}" | Users found: ${users.length}`);

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      totalUsers: users.length,
      users,
    });

  } catch (error) {
    logger.error("Failed to fetch users:", error);

    return res.status(500).json({
      status: "server-error",
      message: "Failed to fetch users",
    });
  }
};

//get UserbyID Endpoint 
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "bad-request",
      message: "Invalid user ID",
    });
  }

  try {
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        status: "not-found",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      status: "server-error",
      message: "Failed to fetch user",
    });
  }
};

module.exports = { getAllUsers, getUserById };
