const logger = require("../libs/logger");
const Chat = require("../models/chatModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.auth?.id;

  if (!userId) {
    return res.status(400).json({
      status: "USER-REQUIRED",
      message: "userId is required",
    });
  }

  if (userId === currentUserId) {
    return res.status(400).json({
      status: "invalid-chat",
      message: "Cannot create chat with yourself",
    });
  }
  
  try {
    let existingChat = await Chat.findOne({
      participants: { $all: [currentUserId, userId], $size: 2 },
    })
      .populate("participants", "-password")
      .populate("latestMessage");

    if (existingChat) {
      return res.status(200).json({
        status: "Previous Chats",
        Message: "Previous chat Fetched",
        existingChat,
      });
    }

    const newChat = await Chat.create({
      participants: [currentUserId, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "participants",
      "-password"
    );

    return res.status(201).json({
      status: "Full-Chats",
      message: "Full-Chat Fetched",
      fullChat,
    });
  } catch (error) {
    return res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Failed to access chat",
      error: error.message,
    });
  }
};

module.exports = { accessChat };
