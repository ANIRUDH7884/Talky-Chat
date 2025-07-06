import { useState } from "react";
import CreateOtp from "../../Components/CreateOtp/CreateOtp";
import VerifyOtp from "../../Components/VerifyOtp/VerifyOtp";

const Register = () => {
  const [step, setStep] = useState("create");

  const handleOtpSent = () => setStep("verify");

  return (
    <div className="register-wrapper">
      {step === "create" && <CreateOtp onOtpSent={handleOtpSent} />}
      {step === "verify" && <VerifyOtp />}
    </div>
  );
};

export default Register;
