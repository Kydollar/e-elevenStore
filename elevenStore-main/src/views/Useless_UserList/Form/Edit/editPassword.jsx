import React, { useState, useEffect } from "react";
import Button from "components/Button";
import {
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPassword() {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");
	const [msg, setMsg] = useState("");


	const navigate = useNavigate();
	const { uuid } = useParams();

	useEffect(() => {
		const getUserById = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/users/${uuid}`);
				setEmail(response.data.email);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.msg);
				}
			}
		};
		getUserById();
	}, [uuid]);

	const updateUserPassword = async (e) => {
		e.preventDefault();
		try {
			await axios.patch(`${process.env.REACT_APP_MY_API}/users/${uuid}/password`, {
				email: email,
				password: password,
				confPassword: confPassword,
			});
			navigate("/users");
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};
	return (
		<form>
			{msg ? <p className="py-4">{msg}</p> : null}
			<div className="flex flex-col gap-y-4">
				<TextField
					type="email"
					label="Email"
					placeholder="Email"
					id="Email"
					value={`${email}`}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<FormControl variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
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
						autoComplete="off"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormControl>
				<FormControl variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
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
						label="Password"
						autoComplete="new-password"
						onChange={(e) => setConfPassword(e.target.value)}
					/>
				</FormControl>
			</div>
			<div className="mt-4">
				<Button
					onClick={updateUserPassword}
					inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all"
				>
					Simpan
				</Button>
			</div>
		</form>
	);
}
