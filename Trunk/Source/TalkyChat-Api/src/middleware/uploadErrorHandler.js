const multer = require('multer');

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'upload-error',
      message: err.message
    });
  } else if (err) {
    return res.status(500).json({
      status: 'server-error',
      message: 'Unexpected error during file upload',
      error: err.message
    });
  }
  next();
};

module.exports = uploadErrorHandler;
