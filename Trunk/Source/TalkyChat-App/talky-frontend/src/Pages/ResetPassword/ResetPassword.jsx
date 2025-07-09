import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { useToast } from "../../Contexts/Toaster/Toaster";
import "./ResetPassword.scss";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!email || !token) {
      navigate("/forgot-password");
    }
  }, [email, token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showSuccess("Password reset successfully!");
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="reset-password-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>

      <div className="reset-password-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <h1>Reset Your Password</h1>
          <p>Create a new password for <strong>{email}</strong></p>
        </div>

        <div className="coming-soon-message">
          <div className="coming-soon-icon">
            <FiCheck />
          </div>
          <h3>Password Reset Verified!</h3>
          <p>This functionality is coming soon. Your password reset token has been validated.</p>
          <p>In a production environment, you would now set your new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="input-group">
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              disabled
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled
            />
          </div>

          <button 
            type="submit" 
            className="reset-button" 
            disabled={true}
          >
            Reset Password <FiArrowRight className="arrow-icon" />
          </button>
        </form>

        <div className="back-to-login">
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;