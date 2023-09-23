import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import RegisterImage from "../../../assets/images/registerImage.webp";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import SendEmail from "./email";
import KodeOTP from "./otp";
import ResetPassword from "./resetPassword";

const steps = ["Enter your registered email", "Enter the OTP code sent to the email", "Update your password"];

export default function HorizontalLabelPositionBelowStepper() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const storedStep = localStorage.getItem("forgotPasswordStep");
    if (storedStep) {
      const parsedStep = parseInt(storedStep, 10);
      setActiveStep(parsedStep);
    }
  }, []);

  useEffect(() => {
    if (activeStep === 2) {
      const handleBeforeUnload = () => {
        localStorage.clear("forgotPasswordStep");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [activeStep]);

  const handleSetActiveStep = (step) => {
    setActiveStep(step);
    localStorage.setItem("forgotPasswordStep", step);
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-700">
      <Helmet>
        <title>Forgot Password - Eleven Store</title>
        <meta name="description" content="Forgot Password - Reset your password" />
      </Helmet>
      <img src={RegisterImage} alt="bg-form-register" className="w-full h-full object-cover" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="z-10 absolute left-1/2 transform -translate-x-1/2 -translate-y-8 bg-white/10 border backdrop-blur py-2 px-4 rounded shadow-md">
            <h1 className="text-xl text-white">Forgot Password</h1>
          </div>
          <div className="bg-gradient-to-br from-neutral-50 to-slate-50/50 rounded-xl p-10 backdrop-blur border-b-2">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 ? <SendEmail setActiveStep={handleSetActiveStep} /> : activeStep === 1 ? <KodeOTP setActiveStep={handleSetActiveStep} /> : <ResetPassword setActiveStep={handleSetActiveStep} />}
          </div>
        </div>
      </div>
    </div>
  );
}
