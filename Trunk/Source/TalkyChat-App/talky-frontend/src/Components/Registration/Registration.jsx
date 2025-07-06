import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion , AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";
import "./Registration.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authURL = import.meta.env.VITE_API_AUTH_URL;

const Registration = ({ email: emailProp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const prevStepRef = useRef(0);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state?.registrationData) {
        setFormData((prev) => ({
          ...prev,
          ...location.state.registrationData,
        }));
      }
    } else if (emailProp) {
      setEmail(emailProp);
    } else {
      navigate("/register");
    }
  }, [location, navigate, emailProp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step >= 0) {
      if (!formData.username.trim()) newErrors.username = "Required";
      else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username))
        newErrors.username = "Invalid format";
    }

    if (step >= 1) {
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Required";
      else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
        newErrors.phoneNumber = "Invalid number";
    }

    if (step >= 2) {
      if (!formData.password) newErrors.password = "Required";
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password
        )
      )
        newErrors.password = "Weak password";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "No match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      prevStepRef.current = currentStep;
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    prevStepRef.current = currentStep;
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}${authURL}Register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email }),
      });
      const data = await response.json();
      if (data.status === "register-success") {
        setIsSubmitted(true);
        navigate("/login", { state: { user: data.user } });
      } else {
        setErrors({ api: data.message || "Registration failed" });
      }
    } catch (err) {
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "Choose Your Username",
      fields: [
        {
          name: "username",
          type: "text",
          icon: <FiUser />,
          placeholder: "e.g. chatmaster42",
        },
      ],
    },
    {
      title: "Add Your Phone",
      fields: [
        {
          name: "phoneNumber",
          type: "tel",
          icon: <FiPhone />,
          placeholder: "e.g. 9876543210",
        },
      ],
    },
    {
      title: "Set Your Password",
      fields: [
        {
          name: "password",
          type: showPassword ? "text" : "password",
          icon: <FiLock />,
          placeholder: "Create strong password",
          extra: (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          ),
        },
        {
          name: "confirmPassword",
          type: showPassword ? "text" : "password",
          icon: <FiLock />,
          placeholder: "Confirm password",
        },
      ],
    },
  ];

  return (
    <div className="registration-container">
      <div className="background-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
      </div>

      <div className="registration-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <div className="progress-steps">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`step ${index === currentStep ? "active" : ""} ${
                  index < currentStep ? "completed" : ""
                }`}
              >
                {index < currentStep ? <FiCheck /> : index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="card-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: currentStep > prevStepRef.current ? 50 : -50,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: currentStep > prevStepRef.current ? -50 : 50,
              }}
              transition={{ duration: 0.3 }}
              className="step-content"
            >
              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <FiCheck />
                  </div>
                  <h2>Registration Complete!</h2>
                  <p>Welcome to TalkyChat community</p>
                </div>
              ) : (
                <>
                  <h2>{steps[currentStep].title}</h2>
                  <p className="verified-email">
                    <FiMail /> {email}{" "}
                    <span className="verified-badge">Verified</span>
                  </p>

                  {errors.api && (
                    <div className="error-message">{errors.api}</div>
                  )}

                  <form
                    onSubmit={
                      currentStep === steps.length - 1
                        ? handleSubmit
                        : (e) => {
                            e.preventDefault();
                            nextStep();
                          }
                    }
                  >
                    {steps[currentStep].fields.map((field) => (
                      <div
                        key={field.name}
                        className={`input-field ${
                          errors[field.name] ? "error" : ""
                        }`}
                      >
                        <div className="input-container">
                          <div className="input-icon">{field.icon}</div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            autoFocus
                          />
                          {field.extra}
                        </div>
                        {errors[field.name] && (
                          <div className="error-text">{errors[field.name]}</div>
                        )}
                      </div>
                    ))}

                    <div className="form-actions">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          className="back-button"
                          onClick={prevStep}
                          disabled={isLoading}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="next-button"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="button-spinner"></div>
                        ) : currentStep === steps.length - 1 ? (
                          "Complete Registration"
                        ) : (
                          <>
                            Continue <FiArrowRight />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="card-footer">
          <p>
            By registering, you agree to our <a href="/terms">Terms</a> and{" "}
            <a href="/privacy">Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
