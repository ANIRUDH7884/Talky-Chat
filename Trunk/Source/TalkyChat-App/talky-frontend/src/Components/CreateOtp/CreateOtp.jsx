import { useState } from "react";
import axios from "axios";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import "./CreateOtp.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

function CreateOtp({ onOtpSent }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      const response = await axios.post(`${baseURL}${authURL}create-otp`, {
        email,
      });

      if (response.data.status === "otp-sent") {
        setShowSuccessModal(true);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    onOtpSent(email);
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="app-brand">
          <div className="logo-icon">TC</div>
          <h1>Talky Chat</h1>
        </div>

        <h2>Create Your Account</h2>
        <p className="subtext">
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSendOtp}>
          <div className={`input-group ${error ? "error" : ""}`}>
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

          <button type="submit" className="submit-btn" disabled={isLoading}>
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
          <button onClick={() => (window.location.href = "/login")}>
            Sign In
          </button>
        </div>
      </div>

      <Modal
        show={showSuccessModal}
        onHide={handleModalClose}
        centered
        backdropClassName="talky-backdrop"
        dialogClassName="talky-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="modal-icon bg-primary-50 text-primary-500">
            <FiCheck size={40} />
          </div>
          <h4 className="modal-title text-gray-900 font-semibold mt-3">
            OTP Sent Successfully
          </h4>
          <p className="modal-message text-gray-600 mt-2">
            We've sent a 4-digit code to your email:{" "}
            <strong className="text-gray-900">{email}</strong>
          </p>
          <Button
            variant="primary"
            className="modal-btn bg-primary-500 hover:bg-primary-600 text-white mt-4"
            onClick={handleModalClose}
          >
            Continue
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CreateOtp;
