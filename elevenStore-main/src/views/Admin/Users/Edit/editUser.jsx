import React from "react";
import Button from "components/Button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "features/roleSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

import { TextField, MenuItem, IconButton, Avatar, Alert } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const schema = yup.object().shape({
	username: yup.string().required("Username is required"),
	name: yup.string().required("Name is required"),
	email: yup.string().required("Email is required").email("Invalid email"),
	file: yup.mixed(),
	roleCategoryUuid: yup.string().required("Role Category is required"),
});

export default function EditUser() {
	const [preview, setPreview] = useState("");
	const [msg, setMsg] = useState("");

	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		mode: "all",
		defaultValues: {
			username: "",
			name: "",
			roleCategoryUuid: "",
			email: "",
		},
		resolver: yupResolver(schema),
	});

	const { uuid } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stateRole = useSelector((state) => state.roleCategories);

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	useEffect(() => {
		if (!uuid) return;
		const getUser = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/users/${uuid}`);
				setValue("username", response.data.username);
				setValue("name", response.data.name);
				setValue("roleCategoryUuid", response.data.roleCategoryUuid);
				setValue("email", response.data.email);
				setValue("file", response.data.avatarUrl);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.msg);
				}
			}
		};
		getUser();
	}, [uuid]);

	const onSubmit = async (data, e) => {
		e.preventDefault();
		try {
			await axios.patch(`${process.env.REACT_APP_MY_API}/users/${uuid}`, data, {
				headers: {
					"Content-type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Akun berhasil diubah, akan di arahkan ke halaman users!",
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
		<form onSubmit={handleSubmit(onSubmit)}>
			{msg && (
				<Alert sx={{ textTransform: "lowercase" }} severity="error">
					{msg}
				</Alert>
			)}
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<Controller
						{...register("username")}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Username"
								placeholder="Username"
								error={!!errors.username}
								helperText={errors.username?.message}
							/>
						)}
					/>
					<div className="flex md:flex-row flex-col justify-between gap-4">
						<Controller
							{...register("name")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="flex-[70%]"
									label="Nama Lengkap"
									placeholder="Nama Lengkap"
									error={!!errors.name}
									helperText={errors.name?.message}
								/>
							)}
						/>
						<Controller
							{...register("roleCategoryUuid")}
							control={control}
							defaultValue={stateRole.isLoading && "loading"}
							render={({ field }) => (
								<TextField
									className="flex-[30%]"
									{...field}
									select
									label="Role"
									error={!!errors.roleCategoryUuid}
									helperText={errors.roleCategoryUuid?.message}
								>
									{stateRole.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
									{stateRole.data &&
										stateRole.data.map((dataRole, idx) => (
											<MenuItem key={dataRole.roleName + idx} value={dataRole.uuid}>
												{dataRole.roleName.charAt(0).toUpperCase() + dataRole.roleName.slice(1)}
											</MenuItem>
										))}
								</TextField>
							)}
						/>
					</div>
					<div className="flex md:flex-row flex-col justify-between gap-4">
						<Controller
							{...register("email")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="flex-[70%]"
									type="email"
									label="Email"
									placeholder="Email"
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							)}
						/>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center text-center">
					<span className="">{null}</span>
					<div className="px-16 py-4">
						<Avatar
							alt="Avatar"
							src={`${preview ? preview : getValues("file")}`}
							sx={{ width: 192, height: 192 }}
						/>
						<div className="flex items-center justify-center">
							<IconButton color="primary" aria-label="changeImage" component="label">
								<input
									{...register("file")}
									hidden
									type="file"
									onChange={(e) => {
										const image = e.target.files[0];
										setValue("file", image);
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
