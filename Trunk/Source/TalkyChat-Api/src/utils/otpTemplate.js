const getOtpEmailTemplate = (otpCode, username = "User") => `
  <div style="max-width: 600px; margin: auto; padding: 25px; border-radius: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(to right, #fdfdfd, #f4f4f4); color: #333; border: 1px solid #e0e0e0;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #4CAF50; font-size: 28px;">🔐 Verify Your Email</h2>
      <p style="font-size: 15px; color: #666;">Secure your Talky Chat experience</p>
    </div>

    <p style="font-size: 16px;">Hey <strong>${username}</strong>,</p>

    <p style="font-size: 15px; line-height: 1.6;">
      We're excited to have you at <strong>Talky Chat</strong>! Use the OTP below to verify your email and get started with private messaging, amazing UI, and real-time chats.
    </p>

    <div style="background: #ffffff; padding: 25px; margin: 30px 0; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: center;">
      <p style="font-size: 18px; margin-bottom: 12px; color: #555;">Your One-Time Password (OTP) is:</p>
      <div style="font-size: 36px; font-weight: bold; color: #4CAF50; letter-spacing: 8px;">
        ${otpCode}
      </div>
      <p style="font-size: 13px; margin-top: 15px; color: #999;">This OTP is valid for <strong>5 minutes</strong>.</p>
    </div>

    <p style="font-size: 14px; color: #555;">If you didn’t request this, please ignore this email. Your account is safe. 👍</p>

    <p style="margin-top: 40px;">Cheers,<br><strong>🚀 Talky Chat Team</strong></p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 12px; color: #888; text-align: center;">
      &copy; ${new Date().getFullYear()} Talky Chat. All rights reserved.<br>
      This is an automated message – please do not reply.
    </p>
  </div>
`;

module.exports = getOtpEmailTemplate;
