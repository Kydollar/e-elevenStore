import React from "react";
import Button from "components/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "features/roleSlice";
import ImageAvatarDummy from "assets/images/avatar.png";
import Swal from "sweetalert2";

import {
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	TextField,
	MenuItem,
	Avatar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function AddUser() {
	const [preview, setPreview] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const [focused, setFocused] = useState(false);

	const handleFocus = (e) => {
		const fieldName = e.target.name;
		setFocused(fieldName, true);
	};

	const [dataUser, setDataUser] = useState({
		username: "",
		name: "",
		email: "",
		password: "",
		confPassword: "",
		roleCategoryUuid: "",
	});

	const [msg, setMsg] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const stateRole = useSelector((state) => state.roleCategories);

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	const handleChangeUser = (e) => {
		const userClone = { ...dataUser };
		userClone[e.target.name] = e.target.value;
		setDataUser(userClone);
	};

	console.log("dataUSER", dataUser);

	const handleAddUser = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				`${process.env.REACT_APP_MY_API}/users`,
				{ ...dataUser, file: dataUser.avatar },
				{
					headers: {
						"Content-type": "multipart/form-data",
					},
				}
			);
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
				navigate("/users");
			});
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};

	return (
		<form onSubmit={handleAddUser}>
			{msg ? <p className="py-4">{msg}</p> : null}
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<TextField
						label="Username"
						placeholder="Username"
						id="Username"
						value={dataUser.username}
						name="username"
						onChange={handleChangeUser}
						error={focused && dataUser.username.length === 0}
						helperText={focused && dataUser.username.length === 0 ? "Name is required" : ""}
						autoComplete="new-username"
						onBlur={handleFocus}
					/>
					<TextField
						label="Nama Lengkap"
						placeholder="Nama Lengkap"
						id="Name"
						value={dataUser.name}
						name="name"
						onChange={handleChangeUser}
						error={focused && dataUser.name.length === 0}
						helperText={focused && dataUser.name.length === 0 ? "Name is required" : ""}
						autoComplete="new-name"
						onBlur={handleFocus}
					/>
					<TextField
						id="Role"
						select
						autoComplete="new-role"
						label="Role"
						name="roleCategoryUuid"
						value={stateRole.isLoading ? "loading" : dataUser.roleCategoryUuid}
						onChange={handleChangeUser}
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
						type="email"
						label="Email"
						placeholder="Email"
						id="Email"
						value={dataUser.email}
						name="email"
						autoComplete="new-email"
						onChange={handleChangeUser}
					/>
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
							name="password"
							autoComplete="new-password"
							onChange={handleChangeUser}
						/>
					</FormControl>
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
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
							name="confPassword"
							autoComplete="new-password"
							onChange={handleChangeUser}
						/>
					</FormControl>
				</div>
				<div className="flex flex-col px-16">
					<Avatar
						alt="Avatar"
						src={`${
							preview ? preview : dataUser.avatarUrl ? dataUser.avatarUrl : ImageAvatarDummy
						}`}
						sx={{ width: 192, height: 192 }}
					/>
					<div className="flex items-center justify-center">
						<IconButton color="primary" aria-label="changeImage" component="label">
							<input
								hidden
								type="file"
								// value={dataUser.avatar}
								onChange={(e) => {
									const image = e.target.files[0];
									setDataUser({ ...dataUser, avatar: image });
									setPreview(URL.createObjectURL(image));
								}}
							/>
							<AddPhotoAlternateIcon fontSize="large" />
							<p className="text-lg mt-1">Upload foto</p>
						</IconButton>
					</div>
				</div>
			</div>
			<div className="mt-4">
				<Button
					type="submit"
					inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all"
				>
					Simpan
				</Button>
			</div>
		</form>
	);
}
