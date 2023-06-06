import React from "react";
import { TextField } from "@mui/material";
import CustomButton from "components/Button";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	newPassword: yup
		.string()
		.required("New Password is required")
		.min(6, "Password must be at least 6 characters"),
	confirmNewPassword: yup
		.string()
		.required("Confirm New Password is required")
		.oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export default function ResetPassword() {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			const email = decodeURIComponent(
				document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, "$1")
			).replace(/%40/g, "@");
			await axios.post(`${process.env.REACT_APP_MY_API}/reset-password`, {
				email: email,
				newPassword: data.newPassword,
				confirmNewPassword: data.confirmNewPassword,
			});

			Swal.fire({
				title: "Success",
				text: "Your password has been reset successfully.",
				icon: "success",
				confirmButtonText: "Next",
			}).then(() => {
				document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				localStorage.removeItem("otpExp");
				localStorage.removeItem("forgotPasswordStep");
				navigate("/");
			});
		} catch (error) {
			console.error("Failed to reset password", error);
			Swal.fire("Error", "Failed to reset password", "error");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="newPassword"
				control={control}
				defaultValue=""
				render={({ field }) => (
					<TextField
						{...field}
						type="password"
						label="New Password"
						fullWidth
						margin="normal"
						required
						error={!!errors.newPassword}
						helperText={errors.newPassword?.message}
					/>
				)}
			/>
			<Controller
				name="confirmNewPassword"
				control={control}
				defaultValue=""
				render={({ field }) => (
					<TextField
						{...field}
						type="password"
						label="Confirm New Password"
						fullWidth
						margin="normal"
						required
						error={!!errors.confirmNewPassword}
						helperText={errors.confirmNewPassword?.message}
					/>
				)}
			/>
			<CustomButton type="submit" primary inputClassName="w-full justify-center mt-6 py-4">
				Update Password
			</CustomButton>
		</form>
	);
}
