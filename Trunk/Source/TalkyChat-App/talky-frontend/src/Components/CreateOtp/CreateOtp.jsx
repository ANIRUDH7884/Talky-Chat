import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";
import "./CreateOtp.scss";

function CreateOtp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/create-otp", { email });
      
      if (response.data.status === "otp-sent") {
        setShowSuccess(true);
        setTimeout(() => navigate("/verify-otp"), 2000);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <motion.div 
        className="otp-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="app-brand">
          <div className="logo-icon">TC</div>
          <h1>Talky Chat</h1>
        </div>

        <h2>Create Your Account</h2>
        <p className="subtext">Enter your email to receive a verification code</p>

        <form onSubmit={handleSendOtp}>
          <div className={`input-group ${error ? 'error' : ''}`}>
            <div className="input-icon">
              <FiMail size={18} />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Send Verification Code <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="footer-links">
          <span>Already have an account?</span>
          <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </motion.div>

      {/* Success Notification */}
      {showSuccess && (
        <motion.div 
          className="success-notification"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="success-content">
            <div className="checkmark">
              <FiCheck size={24} />
            </div>
            <h3>Verification Sent!</h3>
            <p>We've sent a 6-digit code to your email</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CreateOtp;