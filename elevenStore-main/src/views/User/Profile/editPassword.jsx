import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Button from "components/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
	currentPassword: yup.string().required("Current password is required"),
	newPassword: yup
		.string()
		.required("New password is required")
		.min(6, "New password must be at least 6 characters long"),
	confirmNewPassword: yup
		.string()
		.oneOf([yup.ref("newPassword"), null], "Passwords must match")
		.required("Confirm password is required"),
});

export default function Profile() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

	const { user = {} } = useSelector((state) => state?.auth);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		mode: "all",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			// Perform password change logic here
			await axios.put(`${process.env.REACT_APP_MY_API}/users/${user.uuid}/change-password`, data);

			// Show success message
			Swal.fire({
				icon: "success",
				title: "Password updated successfully",
				showConfirmButton: false,
				timer: 1500,
			});

			// Optionally, you can reset the form fields after successful password update
			reset(); // Assuming you have the `reset` function from react-hook-form
		} catch (error) {
			console.error(error);

			// Show error message
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: `${error.response.data.msg}`,
			});
		}
	};

	const handleToggleCurrentPassword = () => {
		setShowCurrentPassword(!showCurrentPassword);
	};

	const handleToggleNewPassword = () => {
		setShowNewPassword(!showNewPassword);
	};

	const handleToggleConfirmNewPassword = () => {
		setShowConfirmNewPassword(!showConfirmNewPassword);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-4 items-start justify-center my-6 w-full">
				<Controller
					{...register("currentPassword")}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							type={showCurrentPassword ? "text" : "password"}
							label="Current Password"
							error={!!errors.currentPassword}
							helperText={errors.currentPassword?.message}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleToggleCurrentPassword}>
											{showCurrentPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Controller
					{...register("newPassword")}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							type={showNewPassword ? "text" : "password"}
							label="New Password"
							error={!!errors.newPassword}
							helperText={errors.newPassword?.message}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleToggleNewPassword}>
											{showNewPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Controller
					{...register("confirmNewPassword")}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							type={showConfirmNewPassword ? "text" : "password"}
							label="Confirm Password"
							error={!!errors.confirmNewPassword}
							helperText={errors.confirmNewPassword?.message}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleToggleConfirmNewPassword}>
											{showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Button type="submit" primary>
					Update Password
				</Button>
			</div>
		</form>
	);
}
