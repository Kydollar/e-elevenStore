import React, { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
	Avatar,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Paper,
	Box,
	FormHelperText,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	InputAdornment,
	IconButton,
	OutlinedInput,
	Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "components/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser, getMe, reset } from "../../../features/authSlice";

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="">
				Eleven Store
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

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
	// .min(6, "Password must be at least 6 characters"),
});

export default function SignInSide() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getMe());
		if (user || isSuccess) {
			navigate("/");
		}
		dispatch(reset());
		// console.table("user", user, isSuccess, isError, isLoading);
	}, [user, isSuccess, dispatch, navigate]);

	const onAuth = (data) => {
		const email = data.email;
		const password = data.password;
		dispatch(LoginUser({ email, password }));
	};

	return (
		<Grid container component="main" sx={{ height: "100vh" }}>
			<CssBaseline />
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: `url(${process.env.REACT_APP_PUBLIC_URL}/mountain.jpg)`,
					backgroundRepeat: "no-repeat",
					backgroundColor: (t) =>
						t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit(onAuth)} sx={{ mt: 1 }}>
						{message && <Alert severity="error">{message}</Alert>}
						<TextField
							{...register("email")}
							margin="normal"
							required
							fullWidth
							label="Username or Email Address"
							autoComplete="email"
							autoFocus
							error={!!errors.email}
							helperText={errors.email?.message}
						/>
						<FormControl variant="outlined" fullWidth margin="normal">
							<InputLabel required error={!!errors.password} htmlFor="outlined-adornment-password">
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
						{/* <FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/> */}
						<Button type="submit" primary inputClassName="w-full justify-center">
							Sign In
						</Button>
						<span className="flex items-center justify-center text-sm text-gray-500 mt-6">
							Belum Memiliki Akun?&nbsp;
							<Link to="/register">
								Daftar
							</Link>
						</span>
						<Copyright sx={{ mt: 5 }} />
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}
