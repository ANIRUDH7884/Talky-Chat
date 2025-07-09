import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiShield, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { useToast } from "../../Contexts/Toaster/Toaster";
import "./VerifyResetOtp.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}${authURL}resend-Otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "reset" }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "Failed to resend OTP");
        return;
      }

      showSuccess("New OTP sent successfully!");
      setCountdown(60);
    } catch (err) {
      showError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      showError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}${authURL}verifyReset-Otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: otpCode, type: "reset" }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "OTP verification failed");
        return;
      }

      showSuccess("OTP verified successfully!");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${data.token}`);
    } catch (err) {
      showError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-reset-otp-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>

      <div className="verify-reset-otp-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <h1>Reset Password Verification</h1>
          <p>Enter the 4-digit OTP sent to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && index > 0) {
                    document.getElementById(`otp-input-${index - 1}`).focus();
                  }
                }}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button type="submit" className="verify-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Verify OTP <FiArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="resend-otp">
          {countdown > 0 ? (
            <p>Resend OTP in {countdown}s</p>
          ) : (
            <button onClick={handleResendOtp} disabled={isLoading}>
              {isLoading ? (
                <FiRefreshCw className="spin-icon" />
              ) : (
                "Resend OTP"
              )}
            </button>
          )}
        </div>

        <div className="back-to-login">
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;