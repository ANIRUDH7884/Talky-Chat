import { useNavigate, useSearchParams } from "react-router-dom";
import { FiShield, FiArrowRight } from "react-icons/fi";
import { useEffect } from "react";
import "./VerifyResetOtp.scss";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  return (
    <div className="verify-reset-otp-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>

      <div className="verify-reset-otp-card">
        <h1>🔐 Reset OTP Verification</h1>
        <p>Coming soon... for <strong>{email}</strong></p>
        <button onClick={() => navigate("/reset-password?email=" + encodeURIComponent(email))}>
          Continue <FiArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default VerifyResetOtp;
