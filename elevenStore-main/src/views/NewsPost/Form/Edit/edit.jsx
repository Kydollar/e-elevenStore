import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import JoditEditor from "jodit-react";
import { Cropper } from "react-cropper";

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
		control,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			slug: "",
			newsCategoryUuid: "",
		},
	});
	const [preview, setPreview] = useState("");
	const [content, setContent] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const stateNewsCategory = useSelector((state) => state.newsCategories);
	const { uuid } = useParams();

	useEffect(() => {
		if (!uuid) return;
		const getNews = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/news/${uuid}`);
				setValue("name", response.data.name);
				setValue("slug", response.data.slug);
				setValue("file", response.data.imageUrl);
				setValue("newsCategoryUuid", response.data.newsCategoryUuid);
				setContent(response.data.content);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getNews();
	}, [uuid]);
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

	useEffect(() => {
		dispatch(fetchNewsCategory());
	}, [dispatch]);

	const onSubmit = async (data, e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("slug", data.slug);
			formData.append("file", preview ? preview : data.file);
			formData.append("newsCategoryUuid", data.newsCategoryUuid);
			formData.append("content", content);
			await axios.patch(`${process.env.REACT_APP_MY_API}/news/${uuid}`, formData, {
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
				console.log(error.response);
			}
		}
	};

	console.log("preview", preview);
	console.log("getV", getValues("file"));

	const getCroppedImage = () => {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => {
				const file = new File([blob], `${watch("slug") ? watch("slug") : "news"}.jpg`, {
					type: "image/jpeg",
				});
				setPreview(file);
				setCropperClicked(false)
				// Perform any necessary actions with the file object, such as uploading it to a server
			}, "image/jpeg");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<Controller
						{...register("name")}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Judul"
								error={errors.name && !!errors.name}
								helperText={errors.name?.message}
								autoComplete="new-judul"
							/>
						)}
					/>
					<Controller
						{...register("slug")}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Slug"
								error={errors.slug && !!errors.slug}
								helperText={errors.slug?.message}
								autoComplete="new-slug"
							/>
						)}
					/>
					<Controller
						{...register("newsCategoryUuid")}
						control={control}
						defaultValue={stateNewsCategory.isLoading && "loading"}
						render={({ field }) => (
							<TextField
								{...field}
								select
								label="News category"
								error={!!errors.newsCategoryUuid}
								helperText={errors.newsCategoryUuid?.message}
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
						)}
					/>
					{!cropperClicked ? (
						<div className="relative">
							<img
								src={`${preview ? URL.createObjectURL(preview) : getValues("file")}`}
								alt=""
								className="h-auto max-w-sm"
							/>
							<Button
								type="button"
								inputClassName="absolute bottom-0 bg-white hover:bg-white/80 m-2"
								onClick={() => setCropperClicked(true)}
							>
								Edit Image
							</Button>
						</div>
					) : (
						<div className="relative">
							<Cropper
								src={`${preview ? URL.createObjectURL(preview) : getValues("file")}`}
								style={{ height: 400, width: "100%" }}
								onInitialized={setCropper}
								initialAspectRatio={16 / 9}
								aspectRatio={16 / 9}
								guides={true}
								cropBoxResizable={true}
								dragMode="move"
								viewMode={1}
							/>
							<Button
								type="button"
								inputClassName="absolute bottom-0 bg-white hover:bg-white/80 m-2"
								onClick={getCroppedImage}
							>
								Crop Image
							</Button>
						</div>
					)}
					<div className="flex items-center justify-start">
						<IconButton color="primary" aria-label="changeImage" component="label">
							<input
								{...register("file")}
								hidden
								type="file"
								onChange={(e) => {
									const image = e.target.files[0];
									setValue("file", image);
									setPreview(image);
									setCropperClicked(true)
								}}
							/>
							<AddPhotoAlternateIcon fontSize="large" />
							<p className="text-lg mt-1 cursor-pointer">Ganti foto</p>
						</IconButton>
					</div>
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
