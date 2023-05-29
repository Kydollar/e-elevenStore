import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import {
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import RegisterImage from "../../../assets/images/registerImage.webp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomButton from "components/Button";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	username: yup
		.string()
		.required("Username is required")
        .matches(/^\S*$/, "Username cannot contain spaces")
		.test("unique-username", "This username is already registered", async (value) => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/users/check?username=${value}`
				);
				return !response.data.exists;
			} catch (error) {
				console.log(error);
			}
		}),
	name: yup.string().required("Name is required"),
	email: yup
		.string()
		.required("Email is required")
		.email("Invalid email")
		.test("unique-email", "This email is already registered", async (value) => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/users/check?email=${value}`
				);
				return !response.data.exists;
			} catch (error) {
				console.log(error);
			}
		}),
	password: yup
		.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters"),
	confPassword: yup
		.string()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onSubmit = (data) => {
		try {
			const formData = new FormData();
			formData.append("username", data.username);
			formData.append("name", data.name);
			formData.append("email", data.email);
			formData.append("password", data.password);
			formData.append("confPassword", data.confPassword);
			axios.post(`${process.env.REACT_APP_MY_API}/register`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Anda berhasil membuat akun!",
				icon: "success",
				confirmButtonText: "Oke",
				allowOutsideClick: false,
				customClass: {
					confirmButton: "confirm",
				},
				buttonsStyling: false,
				timer: 2000,
				timerProgressBar: true,
			}).then(function () {
				navigate("/");
			});
		} catch (error) {
			if (error.response) {
				console.log(error.response);
			}
		}
	};

	return (
		<div className="relative w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-700">
			<img src={RegisterImage} alt="bg-form-register" className="w-full h-full object-cover" />
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<div className="relative">
					<div className="z-10 absolute left-1/2 transform -translate-x-1/2 -translate-y-8 bg-white/10 border backdrop-blur py-2 px-4 rounded shadow-md">
						<h1 className="text-xl text-white">Sign Up</h1>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-gradient-to-br from-neutral-50 to-slate-50/50 rounded-xl p-10 backdrop-blur border-b-2"
					>
						<TextField
							{...register("username")}
							margin="normal"
							fullWidth
							label="Username"
							autoComplete="new-username"
							error={!!errors.username}
							helperText={errors.username?.message}
						/>
						<TextField
							{...register("name")}
							margin="normal"
							fullWidth
							label="Name"
							autoComplete="new-name"
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
						<TextField
							{...register("email")}
							margin="normal"
							fullWidth
							label="Email"
							autoComplete="new-email"
							error={!!errors.email}
							helperText={errors.email?.message}
						/>
						<FormControl variant="outlined" fullWidth margin="normal">
							<InputLabel error={!!errors.password} htmlFor="outlined-adornment-password">
								Password
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								type={showPassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
								autoComplete="new-password"
								{...register("password")}
								error={!!errors.password}
							/>
							<FormHelperText error>{errors.password?.message}</FormHelperText>
						</FormControl>
						<FormControl variant="outlined" fullWidth margin="normal">
							<InputLabel
								error={!!errors.confPassword}
								htmlFor="outlined-adornment-confirm-password"
							>
								Confirm Password
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-confirm-password"
								type={showPassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle confirm password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Confirm Password"
								autoComplete="new-confirm-password"
								{...register("confPassword")}
								error={!!errors.confPassword}
							/>
							<FormHelperText error>{errors.confPassword?.message}</FormHelperText>
						</FormControl>
						<CustomButton type="submit" primary inputClassName="w-full justify-center mt-6 py-4">
							Register
						</CustomButton>
					</form>
				</div>
			</div>
		</div>
	);
}
