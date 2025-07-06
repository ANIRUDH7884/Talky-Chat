import { useState } from "react";
import CreateOtp from "../../Components/CreateOtp/CreateOtp";
import VerifyOtp from "../../Components/VerifyOtp/VerifyOtp";

const Register = () => {
  const [step, setStep] = useState("create");
  const [email, setEmail] = useState("");

  const handleOtpSent = (userEmail) => {
    setEmail(userEmail); 
    setStep("verify"); 
  };

  return (
    <div className="register-wrapper">
      {step === "create" && <CreateOtp onOtpSent={handleOtpSent} />}
      {step === "verify" && <VerifyOtp email={email} />}
    </div>
  );
};

export default Register;
