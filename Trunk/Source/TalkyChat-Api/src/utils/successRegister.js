const getWelcomeEmailTemplate = (username = "User") => `
  <div style="max-width: 650px; margin: auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(145deg, #ffffff, #f3f3f3); border-radius: 15px; color: #333; border: 1px solid #e0e0e0;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #6a1b9a; font-size: 30px; margin: 0;">
        <span style="display: inline-block; animation: wave 1.5s infinite;">👋</span> Welcome to 
        <span style="color:#4CAF50;">Talky Chat</span>
      </h2>
      <p style="font-size: 16px; color: #666;">Your new digital home for smooth and secure chatting!</p>
    </div>

    <p style="font-size: 16px;">Hey <strong>${username}</strong>,</p>

    <p style="font-size: 15px; line-height: 1.6;">
      🎊 We're thrilled to have you with us! Get ready for seamless real-time messaging, cool features, and vibrant conversations.
    </p>

    <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.07); margin: 30px 0;">
      <h3 style="color: #4CAF50; margin-bottom: 10px;">🌟 What You Can Do:</h3>
      <ul style="padding-left: 20px; margin: 0;">
        <li style="margin-bottom: 8px;">💬 Chat with your friends in real-time</li>
        <li style="margin-bottom: 8px;">🔐 Enjoy private, secure conversations</li>
        <li style="margin-bottom: 8px;">📱 Stay connected across all your devices</li>
        <li style="margin-bottom: 8px;">🎨 Customize your profile and themes</li>
      </ul>
    </div>

    <p style="font-size: 15px;">Need any help? Just reply to this email — we’re always here for you! 😊</p>

    <p style="margin-top: 30px;">Cheers,<br><strong>🚀 Talky Chat Team</strong></p>

    <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 12px; color: #999; text-align: center;">
      &copy; ${new Date().getFullYear()} Talky Chat. All rights reserved.<br>
      This is an automated message — no need to reply unless you need support.
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
