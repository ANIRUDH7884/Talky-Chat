import { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Add this import
import "./Login.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.identifier.trim())
      newErrors.identifier = "Email or phone is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError("");

      try {
        const response = await fetch(`${baseURL}${authURL}login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.status === "user-not-found") {
            setApiError("User not found with this email/phone");
          } else if (data.status === "invalid-credentials") {
            setApiError("Incorrect password");
          } else {
            setApiError(data.message || "Login failed");
          }
          return;
        }

        // Login successful
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/Dashboard");
      } catch (error) {
        console.error("Login error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>

      <div className="login-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your conversations</p>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className={`input-group ${errors.identifier ? "error" : ""}`}>
            <div className="input-icon">
              <FiMail />
            </div>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Your email or phone number"
              autoFocus
            />
            {errors.identifier && (
              <span className="error-text">{errors.identifier}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "error" : ""}`}>
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password">
            <button type="button">Forgot password?</button>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Sign In <FiArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <button type="button">Create one</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
