const jwtService = require('../services/jwtService');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'Access token missing or invalid',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return res.status(403).json({
        status: 'forbidden',
        message: 'Invalid token',
      });
    }

    req.auth = {
      id: decoded.UserId,
      email: decoded.Email,
      username: decoded.User,
    };
    

    next();
  } catch (error) {
    return res.status(403).json({
      status: 'forbidden',
      message: 'Invalid or expired token',
    });
  }
};

module.exports = verifyToken;
