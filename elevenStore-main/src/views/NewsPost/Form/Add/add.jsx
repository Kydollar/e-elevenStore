import React, { useState, useEffect, useRef } from "react";
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
	Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";

import JoditEditor from "jodit-react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewsCategory } from "features/newsCategorySlice";
import ImageDummy from "../../../../assets/images/default-placeholder.png";

const schema = yup.object().shape({
	name: yup.string().required("Judul is required"),
	slug: yup.string().required("Slug is required"),
	file: yup.mixed().required("Image is required"),
	newsCategoryUuid: yup.string().required("Role Category is required"),
});

export default function AddThird({ placeholder }) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const [msg, setMsg] = useState("");
	const [content, setContent] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const stateNewsCategory = useSelector((state) => state.newsCategories);
	const [cropper, setCropper] = useState(null);
	const [cropperClicked, setCropperClicked] = useState(false);
	const editor = useRef(null);
	const config = {
		readonly: false, // all options from https://xdsoft.net/jodit/doc/,
		placeholder: placeholder || "Start typings...",
		uploader: {
			insertImageAsBase64URI: true,
		},
		showCharsCounter: true,
		showWordsCounter: true,
		showXPathInStatusbar: false,
		askBeforePasteHTML: true,
		askBeforePasteFromWord: true,
		showTooltip: true,
		showTooltipDelay: 500,
		removeButtons: ["fullsize", "file", "video"],
	};

	const previewImage = watch("file")?.[0];

	useEffect(() => {
		dispatch(fetchNewsCategory());
	}, [dispatch]);

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("slug", data.slug);
			formData.append("file", data.file[0]);
			formData.append("newsCategoryUuid", data.newsCategoryUuid);
			formData.append("content", content);
			await axios.post(`${process.env.REACT_APP_MY_API}/news`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Berhasil membuat postingan baru, akan di arahkan ke halaman users!",
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
				navigate("/news");
			});
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};

	const getCroppedImage = () => {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => {
				const file = new File([blob], `${watch("slug") ? watch("slug") : "news"}.jpg`, {
					type: "image/jpeg",
				});
				setValue("file", [file]);
				setCropperClicked(true);
				// Perform any necessary actions with the file object, such as uploading it to a server
			}, "image/jpeg");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{msg && (
				<Alert sx={{ textTransform: "lowercase", marginY: "10px" }} severity="error">
					{msg}
				</Alert>
			)}
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<TextField
						label="Judul"
						{...register("name")}
						error={errors.name && !!errors.name}
						helperText={errors.name?.message}
						autoComplete="new-judul"
					/>
					<TextField
						label="Slug"
						{...register("slug")}
						error={errors.slug && !!errors.slug}
						helperText={errors.slug?.message}
						autoComplete="new-slug"
					/>
					<TextField
						select
						{...register("newsCategoryUuid")}
						error={errors.newsCategoryUuid && !!errors.newsCategoryUuid}
						helperText={errors.newsCategoryUuid?.message}
						autoComplete="new-newsCategory"
						label="News Category"
						defaultValue={stateNewsCategory.isLoading ? "loading" : ""}
					>
						{stateNewsCategory.isLoading && <MenuItem value={"loading"}>Loading...</MenuItem>}
						{stateNewsCategory.data &&
							stateNewsCategory.data.map((dataNewsCategory, idx) => (
								<MenuItem
									key={dataNewsCategory.newsCategoryName + idx}
									value={dataNewsCategory.uuid}
								>
									{dataNewsCategory.newsCategoryName.charAt(0).toUpperCase() +
										dataNewsCategory.newsCategoryName.slice(1)}
								</MenuItem>
							))}
					</TextField>
					<FormControl variant="outlined">
						{previewImage ? (
							!cropperClicked ? (
								<div className="relative">
									<Cropper
										src={URL.createObjectURL(previewImage)}
										style={{ height: 400, width: "100%" }}
										initialAspectRatio={16 / 9}
										aspectRatio={16 / 9}
										onInitialized={setCropper}
										guides={true}
										cropBoxResizable={true}
										dragMode="move"
										viewMode={1}
									/>
									<Button type="button" inputClassName="absolute bottom-0 bg-white hover:bg-white/80 m-2" onClick={getCroppedImage}>
										Crop Image
									</Button>
								</div>
							) : (
								<div className="relative">
									<img
										src={`${previewImage ? URL.createObjectURL(previewImage) : ImageDummy}`}
										alt=""
										className="h-auto max-w-sm"
									/>
									<Button type="button" inputClassName="absolute bottom-0 bg-white hover:bg-white/80 m-2" onClick={()=> setCropperClicked(false)}>
										Edit Image
									</Button>
								</div>
							)
						) : (
							<img
								src={`${previewImage ? URL.createObjectURL(previewImage) : ImageDummy}`}
								alt=""
								className="h-auto max-w-sm"
							/>
						)}
						<FormHelperText error>{errors.file?.message}</FormHelperText>
						<div className="flex items-center justify-start">
							<IconButton color="primary" aria-label="changeImage" component="label">
								<input hidden type="file" {...register("file")} accept=".jpg,.jpeg,.png" onClick={()=> setCropperClicked(false)}/>
								<AddPhotoAlternateIcon fontSize="large" />
								<p className="text-lg mt-1 cursor-pointer">Upload foto</p>
							</IconButton>
						</div>
					</FormControl>
					<JoditEditor
						ref={editor}
						value={content}
						config={config}
						tabIndex={1} // tabIndex of textarea
						onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
						onChange={(newContent) => {}}
					/>
					<div>
						<Button
							type="submit"
							inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all"
						>
							Simpan
						</Button>
					</div>
				</div>
				{/* <div className="flex flex-col px-16">
					<Avatar
						alt="Avatar"
						src={`${previewImage ? URL.createObjectURL(previewImage) : ImageAvatarDummy}`}
						sx={{ width: 192, height: 192 }}
					/>
					<div className="flex items-center justify-center">
						<IconButton color="primary" aria-label="changeImage" component="label">
							<input
								hidden
								type="file"
								{...register("file")}
							/>
							<AddPhotoAlternateIcon fontSize="large" />
							<p className="text-lg mt-1">Upload foto</p>
						</IconButton>
					</div>
				</div> */}
			</div>
		</form>
	);
}
