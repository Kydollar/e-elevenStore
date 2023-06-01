import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
	Avatar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ImageAvatarDummy from "assets/images/avatar.png";
import Button from "components/Button";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "features/roleSlice";

const schema = yup.object().shape({
	username: yup
		.string()
		.required("Username is required")
		.test("unique-username", "This username is already registered", async (value) => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/users/check?username=${value}`
				);
				return !response.data.exists;
			} catch (error) {
				// console.log(error);
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
				// console.log(error);
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
	file: yup.mixed().required("Image is required"),
	roleCategoryUuid: yup.string().required("Role Category is required"),
});

export default function AddThird() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const stateRole = useSelector((state) => state.roleCategories);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const previewImage = watch("file")?.[0];

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	const onSubmit = (data) => {
		try {
			const formData = new FormData();
			formData.append("username", data.username);
			formData.append("name", data.name);
			formData.append("email", data.email);
			formData.append("password", data.password);
			formData.append("confPassword", data.confPassword);
			formData.append("file", data.file[0]);
			formData.append("roleCategoryUuid", data.roleCategoryUuid);
			axios.post(`${process.env.REACT_APP_MY_API}/users`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Akun berhasil dibuat, akan di arahkan ke halaman users!",
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
				// Redirect the user
				navigate("/admin/users");
			});
		} catch (error) {
			if (error.response) {
				// console.log(error.response);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<TextField
						label="Username"
						{...register("username")}
						error={!!errors.username}
						helperText={errors.username?.message}
						autoComplete="new-username"
					/>
					<TextField
						label="Name"
						{...register("name")}
						error={!!errors.name}
						helperText={errors.name?.message}
						autoComplete="new-name"
					/>
					<TextField
						select
						{...register("roleCategoryUuid")}
						error={!!errors.roleCategoryUuid}
						helperText={errors.roleCategoryUuid?.message}
						autoComplete="new-role"
						label="Role"
						defaultValue={stateRole.isLoading ? "loading" : ""}
					>
						{stateRole.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
						{stateRole.data &&
							stateRole.data.map((dataRole, idx) => (
								<MenuItem key={dataRole.roleName + idx} value={dataRole.uuid}>
									{dataRole.roleName.charAt(0).toUpperCase() + dataRole.roleName.slice(1)}
								</MenuItem>
							))}
					</TextField>
					<TextField
						label="Email"
						{...register("email")}
						error={!!errors.email}
						helperText={errors.email?.message}
						autoComplete="new-email"
					/>
					<FormControl variant="outlined">
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
							autoComplete="new-password"
						/>
						<FormHelperText error>{errors.password?.message}</FormHelperText>
					</FormControl>
					<FormControl variant="outlined">
						<InputLabel error={!!errors.confPassword} htmlFor="outlined-adornment-password">
							Confirm Password
						</InputLabel>
						<OutlinedInput
							id="outlined-adornment-confPassword"
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
							{...register("confPassword")}
							error={!!errors.confPassword}
							autoComplete="new-confPassword"
						/>
						<FormHelperText error>{errors.confPassword?.message}</FormHelperText>
					</FormControl>
					{/* <TextField
						type="password"
						label="Password"
						{...register("password")}
						error={!!errors.password}
						helperText={errors.password?.message}
						autoComplete="new-password"
					/>
					<TextField
						type="password"
						label="Confirm Password"
						{...register("confPassword")}
						error={!!errors.confPassword}
						helperText={errors.confPassword?.message}
						autoComplete="new-confPassword"
					/> */}
					{/* <input type="file" {...register("file")} error={!!errors.file} autoComplete="new-file" /> */}
					{/* <TextField
						label="Role"
						{...register("roleCategoryUuid")}
						error={!!errors.roleCategoryUuid}
						helperText={errors.roleCategoryUuid?.message}
						autoComplete="new-roleCategoryUuid"
					/> */}
					<div>
						<Button type="submit" primary>
							Simpan
						</Button>
					</div>
				</div>
				<div className="flex flex-col px-16">
					<Avatar
						alt="Avatar"
						src={`${previewImage ? URL.createObjectURL(previewImage) : ImageAvatarDummy}`}
						sx={{ width: 192, height: 192 }}
					/>
					<div className="flex items-center justify-center">
						<IconButton color="primary" aria-label="changeImage" component="label">
							<input hidden type="file" {...register("file")} />
							<AddPhotoAlternateIcon fontSize="large" />
							<p className="text-lg mt-1">Upload foto</p>
						</IconButton>
					</div>
				</div>
			</div>
		</form>
	);
}
