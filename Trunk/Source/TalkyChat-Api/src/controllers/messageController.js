const logger = require("../libs/logger");
const { getIO } = require("../config/socket");

const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

//Send Message End-Point
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

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: fullMessage._id,
    });

    const io = getIO();
    if (fullMessage.chat?.participants) {
      fullMessage.chat.participants.forEach((user) => {
        if (user._id.toString() !== senderId) {
          io.to(user._id.toString()).emit("message received", fullMessage);
        }
      });
    }

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

//get All Messages End-Point
const getAllMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({
      status: "bad-request",
      message: "Chat ID is required",
    });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email profilePic")
      .populate("seenBy", "username email profilePic")
      .populate("chat");

    return res.status(200).json({
      status: "success",
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      status: "server-error",
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

module.exports = { sendMessage, getAllMessages };
