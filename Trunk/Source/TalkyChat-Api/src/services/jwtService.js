const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

const REFRESH_EXPIRES_IN = "30d"
const JWT_EXPIRES_IN = '7d';
const RESET_TOKEN_EXPIRES_IN = "15m";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn:REFRESH_EXPIRES_IN});
};

const generateResetToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN });
};

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken };
