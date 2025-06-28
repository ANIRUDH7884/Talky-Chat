require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./src/libs/logger');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoute');
const userRoutes = require('./src/routes/userRoute');
const messageRoutes = require('./src/routes/messageRoute');
const chatRoutes = require('./src/routes/chatRoute')
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/chat', chatRoutes);

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`💬 Talky-Chat Server running on port: ${PORT}`);
  });
});
