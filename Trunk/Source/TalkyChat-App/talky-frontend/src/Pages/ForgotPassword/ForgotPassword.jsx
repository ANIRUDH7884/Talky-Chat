import { useState } from "react";
import { FiMail, FiArrowRight, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Contexts/Toaster/Toaster";
import "./ForgotPassword.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return showError("Email is required");
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}${authURL}forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "Failed to send OTP");
        setError(data.message);
        return;
      }

      showSuccess("4-digit OTP sent to your email!");
      setShowSuccessPopup(true);
    } catch (err) {
      showError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(`/verifyReset-Otp?type=reset&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="forgot-password-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>

      <div className="forgot-password-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <h1>Reset Password</h1>
          <p>We'll send a <strong>4-digit OTP</strong> to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className={`input-group ${error ? "error" : ""}`}>
            <div className="input-icon" style={{ marginBottom: "5px" }}>
              <FiMail />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              autoFocus
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Send OTP <FiArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="back-to-login">
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="otp-success-popup">
          <div className="popup-overlay" onClick={() => setShowSuccessPopup(false)}></div>
          <div className="popup-content">
            <button 
              className="close-button"
              onClick={() => setShowSuccessPopup(false)}
            >
              <FiX />
            </button>
            <div className="popup-header">
              <h3>OTP Sent Successfully</h3>
            </div>
            <div className="popup-body">
              <p>
                We've sent a <strong>4-digit OTP</strong> to <strong>{email}</strong>.
                Please check your inbox.
              </p>
            </div>
            <div className="popup-footer">
              <button className="continue-button" onClick={handleContinue}>
                Continue to Verify <FiArrowRight className="arrow-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;