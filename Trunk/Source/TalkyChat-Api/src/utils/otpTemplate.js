const getOtpEmailTemplate = (otpCode, username = "User") => `
  <div style="max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; background: #f9f9f9; color: #333;">
    <div style="text-align: center;">
      <h2 style="color: #4CAF50;">🔐 OTP Verification</h2>
    </div>
    <p>Hi <strong>${username}</strong>,</p>
    <p>You requested an OTP for verifying your email on <strong>Talky Chat</strong>.</p>

    <div style="background: #ffffff; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center;">
      <p style="font-size: 18px; margin-bottom: 10px;">Your One Time Password (OTP) is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">
        ${otpCode}
      </div>
    </div>

    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
    <p style="margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 12px; color: #777; text-align: center;">
      &copy; ${new Date().getFullYear()} Talky Chat. All rights reserved.
    </p>
  </div>
`;

module.exports = getOtpEmailTemplate;
