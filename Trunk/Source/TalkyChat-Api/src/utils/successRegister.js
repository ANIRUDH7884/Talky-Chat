const getWelcomeEmailTemplate = (username = "User") => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; border-radius: 12px; color: #333;">
    <div style="text-align: center;">
      <h2 style="color: #6a1b9a; font-size: 28px;">👋 <span style="display: inline-block; animation: wave 1.5s infinite;">👋</span> Welcome to <span style="color:#4CAF50;">Talky Chat</span>!</h2>
    </div>

    <p style="font-size: 16px;">Hey <strong>${username}</strong>,</p>

    <p style="font-size: 15px;">🎊 We're super excited to have you on board. Talky Chat is your new home for real-time messaging, smooth UI, and fun interactions!</p>

    <div style="background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 3px 6px rgba(0,0,0,0.1); margin: 20px 0;">
      <p>🌟 What you can do:</p>
      <ul style="padding-left: 20px;">
        <li>💬 Chat with your friends in real-time</li>
        <li>🔐 Enjoy private, secure conversations</li>
        <li>📱 Stay connected across all your devices</li>
        <li>🎨 Customize your profile and themes</li>
      </ul>
    </div>

    <p>Need help? Just reply to this email — we’re always here for you! 😊</p>

    <p style="margin-top: 30px;">Cheers,<br><strong>🚀 Talky Chat Team</strong></p>

    <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;" />

    <p style="font-size: 12px; color: #777; text-align: center;">
      &copy; ${new Date().getFullYear()} Talky Chat. All rights reserved.
    </p>

    <style>
      @keyframes wave {
        0% { transform: rotate(0.0deg); }
        10% { transform: rotate(14.0deg); }
        20% { transform: rotate(-8.0deg); }
        30% { transform: rotate(14.0deg); }
        40% { transform: rotate(-4.0deg); }
        50% { transform: rotate(10.0deg); }
        60% { transform: rotate(0.0deg); }
        100% { transform: rotate(0.0deg); }
      }
    </style>
  </div>
`;

module.exports = getWelcomeEmailTemplate;
