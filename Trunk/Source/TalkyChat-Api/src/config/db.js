const mongoose = require('mongoose');
const logger = require('../libs/logger')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info('🫙  MongoDB connected!');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;