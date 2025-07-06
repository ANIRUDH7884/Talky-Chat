import { useState } from "react";
import CreateOtp from "../../Components/CreateOtp/CreateOtp";
import VerifyOtp from "../../Components/VerifyOtp/VerifyOtp";
import RegisterComplete from "../../Components/Registration/Registration";

const Register = () => {
  const [step, setStep] = useState("create");
  const [email, setEmail] = useState("");

  const handleOtpSent = (userEmail) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleOtpVerified = () => {
    setStep("complete");
  };

  return (
    <div className="register-wrapper">
      {step === "create" && <CreateOtp onOtpSent={handleOtpSent} />}
      {step === "verify" && <VerifyOtp email={email} onVerified={handleOtpVerified} />}
      {step === "complete" && <RegisterComplete email={email} />}
    </div>
  );
};

export default Register;
