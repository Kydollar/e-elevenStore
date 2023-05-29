import React from "react";
import Button from "components/Button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "features/roleSlice";

import { TextField, MenuItem, IconButton, Avatar } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function EditUser() {
	const [preview, setPreview] = useState("");
	const [dataUser, setDataUser] = useState({
		uuid: "",
		username: "",
		avatar: "",
		avatarUrl: "",
		name: "",
		email: "",
		createdAt: "",
		roleCategoryUuid: "",
	});

	const [msg, setMsg] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const stateRole = useSelector((state) => state.roleCategories);
	const { uuid } = useParams();

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	useEffect(() => {
		if (!uuid) return;
		const getUser = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/users/${uuid}`);
				setDataUser(response.data);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.msg);
				}
			}
		};
		getUser();
	}, [uuid]);

	const handleChangeUser = (e) => {
		const userClone = { ...dataUser };
		userClone[e.target.name] = e.target.value;
		setDataUser(userClone);
	};

	const handleUpdateUser = async (e) => {
		e.preventDefault();
		try {
			await axios.patch(
				`${process.env.REACT_APP_MY_API}/users/${uuid}`,
				{ ...dataUser, file: dataUser.avatar },
				{
					headers: {
						"Content-type": "multipart/form-data",
					},
				}
			);
			navigate("/users");
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};

	return (
		<form onSubmit={handleUpdateUser}>
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
					/>
					<div className="flex md:flex-row flex-col justify-between gap-4">
						<TextField
							className="flex-[70%]"
							label="Nama Lengkap"
							placeholder="Nama Lengkap"
							id="Name"
							value={dataUser.name}
							name="name"
							onChange={handleChangeUser}
						/>
						<TextField
							className="flex-[30%]"
							id="Role"
							select
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
					</div>
					<div className="flex md:flex-row flex-col justify-between gap-4">
						{/* <TextField
							className="flex-[20%]"
							id="Job"
							select
							label="Job"
							name="jobCategoryUuid"
							value={state.jobCategories.isLoading ? "loading" : dataUser.jobCategoryUuid}
							onChange={handleChangeUser}
						>
							{state.jobCategories.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
							{state.jobCategories.data &&
								state.jobCategories.data.map((dataJob, idx) => (
									<MenuItem key={dataJob.jobName + idx} value={dataJob.uuid}>
										{dataJob.jobName}
									</MenuItem>
								))}
						</TextField>
						<TextField
							className="flex-[80%]"
							id="Company"
							select
							label="Perusahaan"
							name="companyUuid"
							value={state.companyCategories.isLoading ? "loading" : dataUser.companyUuid}
							onChange={handleChangeUser}
						>
							{state.companyCategories.isLoading && (
								<MenuItem value={"loading"}>Loading...</MenuItem>
							)}
							{state.companyCategories.data &&
								state.companyCategories.data.map((dataCompany, idx) => (
									<MenuItem key={dataCompany.companyName + idx} value={dataCompany.uuid}>
										{dataCompany.companyName}
									</MenuItem>
								))}
						</TextField> */}
					</div>
					<div className="flex md:flex-row flex-col justify-between gap-4">
						{/* <TextField
							className="flex-[30%]"
							id="Shift"
							select
							label="Shift"
							name="shiftUuid"
							value={state.shiftCategories.isLoading ? "loading" : dataUser.shiftUuid}
							onChange={handleChangeUser}
						>
							{state.shiftCategories.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
							{state.shiftCategories.data &&
								state.shiftCategories.data.map((dataShift, idx) => (
									<MenuItem key={dataShift.shiftName + idx} value={dataShift.uuid}>
										{dataShift.shiftName}
									</MenuItem>
								))}
						</TextField> */}
						<TextField
							className="flex-[70%]"
							type="email"
							label="Email"
							placeholder="Email"
							id="Email"
							value={dataUser.email}
							name="email"
							onChange={handleChangeUser}
						/>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center text-center">
					<span className="">{dataUser.createdAt}</span>
					<div className="px-16">
						<Avatar
							alt="Avatar"
							src={`${preview ? preview : dataUser.avatarUrl}`}
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
								<p className="text-lg mt-1">Ganti foto</p>
							</IconButton>
						</div>
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
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { TextField, MenuItem, IconButton, Avatar } from "@mui/material";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import Swal from "sweetalert2";
// import { useNavigate, useParams } from "react-router-dom";
// import ImageAvatarDummy from "assets/images/avatar.png";
// import Button from "components/Button";

// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRoles } from "features/roleSlice";

// const schema = yup.object().shape({
// 	username: yup
// 		.string()
// 		.required("Username is required"),
// 		// .test("unique-username", "This username is already registered", async (value) => {
// 		// 	try {
// 		// 		const response = await axios.get(
// 		// 			`${process.env.REACT_APP_MY_API}/users/check?username=${value}`
// 		// 		);
// 		// 		return !response.data.exists;
// 		// 	} catch (error) {
// 		// 		// console.log(error);
// 		// 	}
// 		// }),
// 	name: yup.string().required("Name is required"),
// 	email: yup
// 		.string()
// 		.required("Email is required")
// 		.email("Invalid email"),
// 		// .test("unique-email", "This email is already registered", async (value) => {
// 		// 	try {
// 		// 		const response = await axios.get(
// 		// 			`${process.env.REACT_APP_MY_API}/users/check?email=${value}`
// 		// 		);
// 		// 		return !response.data.exists;
// 		// 	} catch (error) {
// 		// 		// console.log(error);
// 		// 	}
// 		// }),
// 	file: yup.mixed().required("Image is required"),
// 	roleCategoryUuid: yup.string().required("Role Category is required"),
// });

// export default function EditUser() {
// 	const {
// 		register,
// 		handleSubmit,
// 		watch,
// 		formState: { errors },
// 	} = useForm({
// 		mode: "all",
// 		resolver: yupResolver(schema),
// 	});
// 	const [dataUser, setDataUser] = useState({
// 		uuid: "",
// 		username: "",
// 		avatar: "",
// 		avatarUrl: "",
// 		name: "",
// 		email: "",
// 		createdAt: "",
// 		roleCategoryUuid: "",
// 	});
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();
// 	const stateRole = useSelector((state) => state.roleCategories);
// 	const { uuid } = useParams();

// 	const previewImage = watch("file")?.[0];

// 	useEffect(() => {
// 		dispatch(fetchRoles());
// 	}, [dispatch]);

// 	useEffect(() => {
// 		if (!uuid) return;
// 		const getUser = async () => {
// 			try {
// 				const response = await axios.get(`${process.env.REACT_APP_MY_API}/users/${uuid}`);
// 				setDataUser(response.data);
// 			} catch (error) {
// 				if (error.response) {
// 					console.log(error.response.data.msg);
// 				}
// 			}
// 		};
// 		getUser();
// 	}, [uuid]);

// 	const handleChangeUser = (e) => {
// 		const userClone = { ...dataUser };
// 		userClone[e.target.name] = e.target.value;
// 		setDataUser(userClone);
// 	};

// 	const onSubmit = (data) => {
// 		try {
// 			const formData = new FormData();
// 			formData.append("username", data.username);
// 			formData.append("name", data.name);
// 			formData.append("email", data.email);
// 			formData.append("file", data.file[0]);
// 			formData.append("roleCategoryUuid", data.roleCategoryUuid);
// 			axios.patch(`${process.env.REACT_APP_MY_API}/users`, formData, {
// 				headers: {
// 					"Content-Type": "multipart/form-data",
// 				},
// 			});
// 			Swal.fire({
// 				title: "Berhasil",
// 				text: "Akun berhasil dibuat, akan di arahkan ke halaman users!",
// 				icon: "success",
// 				confirmButtonText: "Oke",
// 				allowOutsideClick: false,
// 				customClass: {
// 					confirmButton: "confirm",
// 				},
// 				buttonsStyling: false,
// 				timer: 2000,
// 				timerProgressBar: true,
// 			}).then(function () {
// 				// Redirect the user
// 				navigate("/users");
// 			});
// 		} catch (error) {
// 			if (error.response) {
// 				// console.log(error.response);
// 			}
// 		}
// 	};
// 	return (
// 		<form onSubmit={handleSubmit(onSubmit)}>
// 			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
// 				<div className="flex flex-col w-full gap-y-4 flex-grow">
// 					<TextField
// 						label="Username"
// 						{...register("username")}
// 						error={!!errors.username}
// 						helperText={errors.username?.message}
// 						autoComplete="new-username"
// 						value={dataUser.username}
// 						onChange={handleChangeUser}
// 					/>
// 					<TextField
// 						label="Name"
// 						{...register("name")}
// 						error={!!errors.name}
// 						helperText={errors.name?.message}
// 						autoComplete="new-name"
// 						value={dataUser.name}
// 						onChange={handleChangeUser}
// 					/>
// 					<TextField
// 						select
// 						{...register("roleCategoryUuid")}
// 						error={!!errors.roleCategoryUuid}
// 						helperText={errors.roleCategoryUuid?.message}
// 						autoComplete="new-role"
// 						label="Role"
// 						value={stateRole.isLoading ? "loading" : dataUser.roleCategoryUuid}
// 						onChange={handleChangeUser}
// 					>
// 						{stateRole.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
// 						{stateRole.data &&
// 							stateRole.data.map((dataRole, idx) => (
// 								<MenuItem key={dataRole.roleName + idx} value={dataRole.uuid}>
// 									{dataRole.roleName.charAt(0).toUpperCase() + dataRole.roleName.slice(1)}
// 								</MenuItem>
// 							))}
// 					</TextField>
// 					<TextField
// 						label="Email"
// 						{...register("email")}
// 						error={!!errors.email}
// 						helperText={errors.email?.message}
// 						autoComplete="new-email"
// 						value={dataUser.email}
// 						onChange={handleChangeUser}
// 					/>
// 					<div>
// 						<Button
// 							type="submit"
// 							inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all"
// 						>
// 							Simpan
// 						</Button>
// 					</div>
// 				</div>
// 				<div className="flex flex-col px-16">
// 					<Avatar
// 						alt="Avatar"
// 						src={`${previewImage ? URL.createObjectURL(previewImage) : ImageAvatarDummy}`}
// 						sx={{ width: 192, height: 192 }}
// 					/>
// 					<div className="flex items-center justify-center">
// 						<IconButton color="primary" aria-label="changeImage" component="label">
// 							<input hidden type="file" {...register("file")} />
// 							<AddPhotoAlternateIcon fontSize="large" />
// 							<p className="text-lg mt-1">Upload foto</p>
// 						</IconButton>
// 					</div>
// 				</div>
// 			</div>
// 		</form>
// 	);
// }
