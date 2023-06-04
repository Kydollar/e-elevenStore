import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	Select,
	Button,
	InputAdornment,
} from "@mui/material";
import CustomButton from "components/Button";
import axios from "axios";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageDummy from "assets/images/default-placeholder.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	nameProduct: yup.string().required("Product name is required"),
	slug: yup.string().required("Slug is required"),
	desc: yup.string().required("Description is required"),
	productCategoryUuid: yup.string().required("Product category UUID is required"),
	stock: yup.string().required("Stock is required"),
	price: yup.string().required("Price is required"),
	file: yup
		.mixed()
		.required("File is required")
		.test("fileSize", "File size is too large", (value) => {
			if (!value) return true; // Allow empty values (in case no file is selected)
			return value.size <= 5000000; // Maximum file size is 5MB
		}),
});

export default function AddProducts() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});
	const [previewImage, setPreviewImage] = useState(null);
	const [productCategories, setProductCategories] = useState([]);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	useEffect(() => {
		fetchProductCategories();
	}, []);

	const fetchProductCategories = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_MY_API}/product-categories`);
			setProductCategories(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	console.log(productCategories);

	const onSubmit = async (data) => {
		console.log(data);
		try {
			const formData = new FormData();
			formData.append("nameProduct", data.nameProduct);
			formData.append("slug", data.slug);
			formData.append("desc", data.desc);
			formData.append("productCategoryUuid", data.productCategoryUuid);
			formData.append("stock", parseInt(data.stock));
			formData.append("price", parseInt(data.price));
			formData.append("file", data.file);

			await axios.post(`${process.env.REACT_APP_MY_API}/product`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Product berhasil disimpan, akan di arahkan ke halaman product!",
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
				navigate("/admin/products");
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Error",
				text: `An error occurred while saving the product. ${error.response.data.msg}`,
				icon: "error",
				confirmButtonText: "OK",
				allowOutsideClick: false,
				customClass: {
					confirmButton: "confirm",
				},
				buttonsStyling: false,
			});
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setPreviewImage(URL.createObjectURL(file));
		setValue("file", file);
	};

	const handleClickUpload = () => {
		fileInputRef.current.click();
	};

	const handleNameInputChange = (event) => {
		const name = event.target.value;
		const slug = generateSlug(name);
		setValue("slug", slug);
	};

	const generateSlug = (name) => {
		// Generate slug logic here
		// Example: Convert name to lowercase and replace spaces with dashes
		return name.toLowerCase().replace(/\s+/g, "-");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col w-full gap-y-4 flex-grow">
				<div className="flex flex-col md:flex-row gap-4">
					<TextField
						fullWidth
						label="Product Name"
						{...register("nameProduct")}
						error={!!errors.nameProduct}
						helperText={errors.nameProduct?.message}
						onInput={handleNameInputChange}
					/>
					<FormControl error={!!errors.productCategoryUuid} variant="outlined" fullWidth>
						<InputLabel id="product-category-label">Product Category</InputLabel>
						<Select
							labelId="product-category-label"
							label="Product Category"
							{...register("productCategoryUuid")}
						>
							{productCategories.map((category) => (
								<MenuItem key={category.uuid} value={category.uuid}>
									{category.productCategoryName.charAt(0).toUpperCase() +
										category.productCategoryName.slice(1)}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{errors.productCategoryUuid?.message}</FormHelperText>
					</FormControl>
				</div>
				<div className="flex md:flex-row flex-col gap-4">
					<div className="flex flex-col">
						<div className="w-full h-full rounded-lg overflow-hidden">
							<img
								alt="Product Image"
								src={previewImage || ImageDummy}
								className="object-contain h-full w-[400px]"
							/>
						</div>
						<div className="flex items-center justify-start mt-4">
							<Button
								variant="outlined"
								aria-label="changeImage"
								startIcon={<AddPhotoAlternateIcon fontSize="large" />}
								onClick={handleClickUpload}
							>
								Upload
							</Button>
							<input
								hidden
								type="file"
								{...register("file")}
								ref={fileInputRef}
								onChange={handleImageChange}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-4 grow">
						<TextField
							sx={{ display: "none" }}
							fullWidth
							label="Slug"
							{...register("slug")}
							error={!!errors.slug}
							helperText={errors.slug?.message}
						/>
						<TextField
							label="Stock"
							{...register("stock")}
							type="text"
							error={!!errors.stock}
							helperText={errors.stock?.message}
							InputProps={{
								pattern: "^[0-9]*$",
								inputMode: "numeric",
								onKeyDown: (event) => {
									const key = event.key;
									const isBackspaceOrDelete = key === "Backspace" || key === "Delete";
									if (!isBackspaceOrDelete) {
										const regex = /^[0-9]+$/;
										if (!regex.test(key)) {
											event.preventDefault();
										}
									}
								},
							}}
						/>
						<TextField
							label="Price"
							{...register("price")}
							type="text"
							error={!!errors.price}
							helperText={errors.price?.message}
							InputProps={{
								inputMode: "numeric",
								onKeyDown: (event) => {
									const key = event.key;
									const isBackspaceOrDelete = key === "Backspace" || key === "Delete";
									if (!isBackspaceOrDelete) {
										const regex = /^[0-9]+$/;
										if (!regex.test(key)) {
											event.preventDefault();
										}
									}
								},
								startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
							}}
						/>
						<TextField
							label="Description"
							multiline
							minRows={4}
							fullWidth
							{...register("desc")}
							error={!!errors.desc}
							helperText={errors.desc?.message}
						/>
					</div>
				</div>
				<div className="flex justify-end gap-4">
					<CustomButton type="submit" primary>
						Simpan Product
					</CustomButton>
				</div>
			</div>
		</form>
	);
}
