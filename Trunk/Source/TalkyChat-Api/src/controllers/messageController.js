const logger = require("../libs/logger");
const Message = require("../models/messageModel");
const chat = require("../models/messageModel");

//send Message End-Point
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const senderId = req.auth?.id;

  if (!content || !chatId) {
    return res.status(400).json({
      status: "bad-request",
      message: "Message content and chatId are required",
    });
  }

  try {
    const message = await Message.create({
      sender: senderId,
      content,
      chat: chatId,
      seenBy: [senderId],
    });

    const fullMessage = await Message.findById(message._id)
      .populate("sender", "username email profilePic")
      .populate("chat")
      .populate("seenBy", "username email profilePic");

    await chat.findByIdAndUpdate(chatId, {
      latestMessage: fullMessage._id,
    });

    return res.status(201).json({
      status: "message-sent",
      message: "Message sent successfully",
      data: fullMessage,
    });
  } catch (error) {
    return res.status(500).json({
      status: "server-error",
      message: "Failed to send message",
      error: error.message,
    });
  }
};

module.exports = { sendMessage }