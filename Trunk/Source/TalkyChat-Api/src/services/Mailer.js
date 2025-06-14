const nodemailer = require('nodemailer');
const logger = require('../libs/logger')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Talky Chat" <${process.env.MAILER_EMAIL}>`,
      to,
      subject,
      html
    });
    logger.info("Email sent:", info.response);
  } catch (err) {
    logger.error("Email error:", err);
    throw err;
  }
};

module.exports = { sendEmail };
