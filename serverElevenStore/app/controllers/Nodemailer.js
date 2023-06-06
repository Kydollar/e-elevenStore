import transporter from "../../config/Nodemailer.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import argon2 from "argon2";

function generateOTP() {
	const otpLength = 6; // Panjang kode OTP yang diinginkan
	const otpChars = "0123456789"; // Karakter yang digunakan dalam kode OTP
	let otp = "";

	for (let i = 0; i < otpLength; i++) {
		const randomIndex = Math.floor(Math.random() * otpChars.length);
		otp += otpChars[randomIndex];
	}

	return otp;
}

export const sendEmail = async (req, res) => {
	const { to } = req.body;

	try {
		const user = await Users.findOne({ where: { email: to } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const otpCode = generateOTP(); // Generate OTP code
		const otpCodeExpiration = new Date(Date.now() + 300000); // Set expiration to 5 minutes from now

		await user.update({ otpCode, otpCodeExpiration }); // Update user with OTP code and expiration

		await transporter.sendMail({
			from: process.env.MAIL_ADDRESS,
			to: to,
			subject: "Verification OTP code to reset your password",
			text: otpCode,
		});

		res.cookie("email", to);

		res.status(200).json({ message: "Email sent successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const validateOTP = async (req, res) => {
	const { otp } = req.body;

	try {
		const user = await Users.findOne({
			where: {
				otpCode: otp,
				otpCodeExpiration: {
					[Op.gt]: new Date(),
				},
			},
			attributes: ["otpCode", "otpCodeExpiration"],
		});

		if (user) {
			// OTP is valid and not expired
			res.status(200).json({ message: "OTP is valid" });
		} else {
			// OTP is invalid or expired
			res.status(400).json({ message: "Invalid OTP" });
		}
	} catch (error) {
		res.status(500).json({ message: "Failed to validate OTP" });
	}
};

export const getOtpExp = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await Users.findOne({
			where: { email: email },
			attributes: ["otpCodeExpiration"],
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const { otpCodeExpiration } = user;

		res.status(200).json({ otpCodeExpiration });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const resendOTP = async (req, res) => {
	const { email } = req.cookies;

	try {
		const user = await Users.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const otpCode = generateOTP(); // Generate a new OTP code
		const otpCodeExpiration = new Date(Date.now() + 300000); // Set expiration to 5 minutes from now

		await user.update({ otpCode, otpCodeExpiration }); // Update user with new OTP code and expiration

		await transporter.sendMail({
			from: process.env.MAIL_ADDRESS,
			to: email,
			subject: "Verification OTP code to reset your password",
			text: otpCode,
		});

		res.status(200).json({ message: "OTP resent successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const endEmail = async (req, res) => {
	res.clearCookie("email"); // Clear the email cookie
	res.status(200).json({ message: "Email process ended" });
};

export const resetNewPassword = async (req, res) => {
	const { email, newPassword, confirmNewPassword } = req.body;

	try {
		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({ message: "Passwords do not match" });
		}

		const user = await Users.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update the user's password
		const hashedNewPassword = await argon2.hash(newPassword);

		await user.update({ password: hashedNewPassword, otpCode: null, otpCodeExpiration: null });

		res.status(200).json({ message: "Password reset successful" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
