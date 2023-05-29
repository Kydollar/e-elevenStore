import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TextField, MenuItem, InputAdornment, Divider, Avatar, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import Button from "components/Button";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "features/roleSlice";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	username: yup.string().required("Username is required"),
	name: yup.string().required("Name is required"),
	email: yup.string().required("Email is required"),
});

export default function Profile() {
	const [preview, setPreview] = useState("");

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
			email: "",
		},
		resolver: yupResolver(schema),
	});
	const { user = {} } = useSelector((state) => state?.auth);
	const navigate = useNavigate();

	useEffect(() => {
		// Set default values for the form fields
		setValue("username", user?.username || "");
		setValue("name", user?.name || "");
		setValue("email", user?.email || "");
		setValue("file", user?.avatarUrl || "");
		setPreview(user?.avatarUrl || "");
	}, [user, setValue]);

	const onSubmit = handleSubmit(async (data) => {
		try {
			await axios.patch(`${process.env.REACT_APP_MY_API}/users/profile/${user?.uuid}`, data, {
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
				console.log(error.response.data.msg);
			}
		}
	});

	return (
		<div className="flex flex-col pt-2">
			<div className="flex justify-between items-center pb-4">
				<h1>Profile</h1>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 items-start justify-center my-6">
					<div className="flex flex-row w-full">
						<div className="flex flex-col w-full gap-y-4 flex-grow">
							<Controller
								{...register("username")}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Username"
										error={!!errors.username}
										helperText={errors.username?.message}
										autoComplete="new-username"
									/>
								)}
							/>
							<Controller
								{...register("name")}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Nama Penerima"
										error={!!errors.name}
										helperText={errors.name?.message}
										autoComplete="new-name"
									/>
								)}
							/>
							<Controller
								{...register("email")}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Email"
										error={!!errors.email}
										helperText={errors.email?.message}
										autoComplete="new-email"
									/>
								)}
							/>
						</div>
						<div className="flex flex-col justify-center items-center text-center">
							<span className="">{null}</span>
							<div className="px-16 py-4">
								<Avatar
									alt={`${user?.name} Avatar`}
									src={preview || getValues("file") || user?.avatarUrl}
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
									</IconButton>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-shrink-0">
						<Button type="submit" primary>
							Perbarui
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
