require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const logger = require("./src/libs/logger");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/config/socket");

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const messageRoutes = require("./src/routes/messageRoute");
const chatRoutes = require("./src/routes/chatRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

// HTTP Server
const httpServer = http.createServer(app);

// DB + Socket Init
connectDB().then(() => {
  initSocket(httpServer);
  httpServer.listen(PORT, () => {
    logger.info(`💬 Talky-Chat Server running with Socket.IO on port: ${PORT}`);
  });
});
