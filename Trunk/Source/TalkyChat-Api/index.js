require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./src/libs/logger')
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB first, then start server
connectDB().then(() => {
  app.get('/', (req, res) => {
    res.send("🚀 Talky-Chat Server is running!");
  });

  app.listen(PORT, () => {
    logger.info(`💬 Talky-Chat Server running on port: ${PORT}`);
  });
});