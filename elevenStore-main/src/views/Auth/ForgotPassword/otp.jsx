import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import CustomButton from "components/Button";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { ArrowBack } from "@mui/icons-material";

const schema = yup.object().shape({
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

export default function KodeOTP(props) {
  const { setActiveStep } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const [expirationTime, setExpirationTime] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const storedExpirationTime = localStorage.getItem("otpExp");
    if (storedExpirationTime) {
      const { expires } = JSON.parse(storedExpirationTime);
      setExpirationTime(expires);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      if (currentTime >= expirationTime) {
        clearInterval(interval);
        localStorage.removeItem("otpExp");
        localStorage.removeItem("forgotPasswordStep");
        setExpirationTime(0);
        setIsExpired(true);
      } else {
        setRemainingTime(expirationTime - currentTime);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [expirationTime]);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${process.env.REACT_APP_MY_API}/validate-otp`, {
        otp: data.otp,
      });

      Swal.fire({
        title: "Success",
        text: "OTP is valid",
        icon: "success",
        confirmButtonText: "Next",
      }).then(() => {
        setActiveStep(2); // Move to the next step
      });
    } catch (error) {
      console.error("Failed to validate OTP", error);
      Swal.fire("Error", "Failed to validate OTP", "error");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue("otp", inputValue);
    if (inputValue.length === 6) {
      handleSubmit(onSubmit)();
      localStorage.removeItem("forgotPasswordStep");
    }
  };

  const handleResendOTP = async () => {
    try {
      const email = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, "$1")).replace(/%40/g, "@");
      const response = await axios.post(`${process.env.REACT_APP_MY_API}/resend-otp`, {
        email: email,
      });

      const newExpirationTime = new Date().getTime() + 300000; // Set expiration to 5 minutes from now
      Swal.fire({
        title: "Success",
        text: "OTP resent successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.setItem("otpExp", JSON.stringify({ expires: newExpirationTime }));
        setActiveStep(1); // Move to the next step
        window.location.reload(); // Reload the page
      });

      // Reset expirationTime
      setExpirationTime(newExpirationTime);
    } catch (error) {
      console.error("Failed to resend OTP", error);
      Swal.fire("Error", "Failed to resend OTP", "error");
    }
  };

  const handleBack = () => {
    localStorage.removeItem("otpExp");
    localStorage.removeItem("forgotPasswordStep");
    setActiveStep(0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Controller
          name="otp"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} label="OTP" fullWidth margin="normal" required error={!!errors.otp} helperText={errors.otp?.message} onInput={handleInputChange} disabled={isExpired} />}
        />
        <div className="flex flex-col justify-center items-center">
          <button type="button" className="text-sm text-blue-500 hover:opacity-50" onClick={handleResendOTP}>
            resend otp code to email
          </button>
          {expirationTime > 0 && !isExpired && <p className="mt-4 text-center text-gray-500">Time remaining: {formatTime(remainingTime)}</p>}
        </div>
      </div>
      <IconButton aria-label="back" color="secondary" className="!mt-4" onClick={handleBack}>
        <ArrowBack />
      </IconButton>
    </form>
  );
}
