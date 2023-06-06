import express from "express";
import { getOtpExp, resendOTP, resetNewPassword, sendEmail, validateOTP } from "../controllers/Nodemailer.js";

const router = express.Router();

// Endpoint untuk mengirim email
router.post("/send-email", sendEmail);
router.post("/validate-otp", validateOTP);
router.get('/get-otpexp', getOtpExp);
router.post("/resend-otp", resendOTP);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", resetNewPassword);


export default router;
