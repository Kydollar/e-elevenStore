import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	TextField,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
	Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CustomButton from "components/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, getMe, reset } from "features/authSlice";

const schema = yup.object().shape({
	email: yup
		.string()
		.required("Email/Username is required")
		.test("unique-email", "User tidak ditemukan", async (value) => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/users/check?${
						value.includes("@") ? "email" : "username"
					}=${value}`
				);
				return response.data.exists;
			} catch (error) {
				// console.log(error);
			}
		}),
	password: yup.string().required("Password is required"),
});

export default function LoginSecond(props) {
	const { handleCloseLogin } = props;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const { user, isSuccess, message } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (user || isSuccess) {
			window.location.reload();
		}
		dispatch(reset());
	}, [user, isSuccess, dispatch, navigate]);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	const emailRef = useRef(null); // Create a ref for the email TextField

	useEffect(() => {
		emailRef.current.focus(); // Set the focus on the email TextField
	}, []);

	const onAuth = (data) => {
		const email = data.email;
		const password = data.password;
		dispatch(LoginUser({ email, password }));
	};

	return (
		<div className="p-8 bg-white w-[400px] flex flex-col gap-2 rounded-lg">
			<div className="self-end">
				<IconButton
					aria-label="close"
					onClick={handleCloseLogin}
					className="hover:text-red-500 !p-0"
				>
					<HighlightOffIcon />
				</IconButton>
			</div>
			{message && message !== "Mohon login ke akun Anda!" && (
				<Alert severity="error">{message}</Alert>
			)}
			<form className="relative w-full" onSubmit={handleSubmit(onAuth)}>
				<h1 className="font-bold">LOGIN</h1>
				<TextField
					{...register("email")}
					margin="normal"
					fullWidth
					label="Email or Username"
					autoComplete="email"
					error={!!errors.email}
					helperText={errors.email?.message}
					inputRef={emailRef} // Assign the ref to the email TextField
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
						{...register("password")}
						error={!!errors.password}
						autoComplete="current-password"
					/>
					<FormHelperText error>{errors.password?.message}</FormHelperText>
				</FormControl>
				<span className="flex items-center justify-end text-sm text-gray-500">
					<Link to="/forgot-password" className="hover:text-blue-600 transition-all">
						Lupa password?
					</Link>
				</span>
				<CustomButton type="submit" primary inputClassName="w-full justify-center mt-6">
					Sign In
				</CustomButton>
				<span className="flex items-center justify-center text-sm text-gray-500 mt-6">
					Belum Memiliki Akun?&nbsp;
					<Link to="/register" className="text-gray-800 hover:text-blue-600 transition-all">
						Daftar
					</Link>
				</span>
			</form>
		</div>
	);
}
