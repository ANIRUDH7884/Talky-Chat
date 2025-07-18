import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { useToast } from "../../Contexts/Toaster/Toaster";
import "./VerifyOtp.scss";

function VerifyOtp({ email, onVerified }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const authURL = import.meta.env.VITE_API_AUTH_URL;

  const { showSuccess, showError } = useToast();

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setError("Please enter a valid 4-digit code");
      showError("Invalid OTP. It must be 4 digits.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseURL}${authURL}Verify-Otp`, {
        email,
        otpCode,
      });

      if (response.data.status === "otp-verified") {
        setIsVerified(true);
        showSuccess("OTP verified successfully!");
        onVerified();
      } else {
        const msg = response.data.message || "OTP verification failed";
        setError(msg);
        showError(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <motion.div
        className="verify-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="app-brand">
          <div className="logo-icon">TC</div>
          <h1>Talky Chat</h1>
        </div>

        <h2>Verify Your Account</h2>
        <p className="subtext">
          Enter the 4-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="verify-btn"
            disabled={isLoading || isVerified}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : isVerified ? (
              <>
                Verified <FiCheck className="icon" />
              </>
            ) : (
              <>
                Verify <FiArrowRight className="icon" />
              </>
            )}
          </button>
        </form>

        <div className="footer-links">
          <span>Didn't receive code?</span>
          <button onClick={() => showInfo("Resend logic coming soon!")}>
            Resend Code
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyOtp;
