import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../../Contexts/Toaster/Toaster";
import "./ResetPassword.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!email || !token) {
      navigate("/forgot-password");
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}${authURL}reset-password`,
        {
          email,
          token,
          newPassword: password,
          confirmPassword,
        }
      );

      if (response.data?.status === "password-reset") {
        showSuccess("Password reset successfully!");
        navigate("/dashboard");
      } else {
        showError(response.data?.message || "Failed to reset password");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Reset failed";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="input-group">
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="password-strength">
            <div className={`strength-indicator ${password.length >= 8 ? 'strong' : password.length >= 4 ? 'medium' : 'weak'}`}></div>
            <span className="strength-text">
              {password.length >= 8 ? 'Strong' : password.length >= 4 ? 'Medium' : 'Weak'} password
            </span>
          </div>

          <button
            type="submit"
            className={`reset-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Reset Password <FiArrowRight className="arrow-icon" />
              </>
            )}
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
