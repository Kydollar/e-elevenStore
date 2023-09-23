import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Konfigurasi SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

export default transporter;
