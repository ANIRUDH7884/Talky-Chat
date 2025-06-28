const jwtService = require("../services/jwtService");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Access token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtService.verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(403).json({
        status: "forbidden",
        message: "Invalid or expired token",
      });
    }

    req.auth = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      status: "forbidden",
      message: "Token verification failed",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
