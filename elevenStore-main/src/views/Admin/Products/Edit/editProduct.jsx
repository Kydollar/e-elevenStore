import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useNavigate, useParams } from "react-router-dom";

const schema = yup.object().shape({
	nameProduct: yup.string().required("Product name is required"),
	desc: yup.string().required("Description is required"),
	productCategoryUuid: yup.string().required("Product category UUID is required"),
	stock: yup.string().required("Stock is required"),
	price: yup.string().required("Price is required"),
	file: yup.mixed(),
});

export default function EditProduct() {
	const { uuid } = useParams();
	const {
		control,
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
		fetchProduct();
	}, []);

	const fetchProductCategories = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_MY_API}/product-categories`);
			setProductCategories(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const fetchProduct = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_MY_API}/product/${uuid}`);
			const product = response.data;
			setValue("nameProduct", product.nameProduct);
			setValue("desc", product.desc);
			setValue("productCategoryUuid", product.productCategoryUuid);
			setValue("stock", product.stock.toString());
			setValue("price", product.price.toString());
			setPreviewImage(product.imageUrl);
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			formData.append("nameProduct", data.nameProduct);
			formData.append("desc", data.desc);
			formData.append("productCategoryUuid", data.productCategoryUuid);
			formData.append("stock", parseInt(data.stock));
			formData.append("price", parseInt(data.price));
			if (data.file) {
				formData.append("file", data.file[0]);
			}

			await axios.put(`${process.env.REACT_APP_MY_API}/product/${uuid}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Product berhasil diubah, akan diarahkan ke halaman product!",
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
			Swal.fire({
				title: "Error",
				text: `An error occurred while updated the product. ${error.response.data.msg}`,
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

	const handleImageUpload = () => {
		const fileInput = fileInputRef.current;
		fileInput.click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPreviewImage(URL.createObjectURL(file));
			setValue("file", e.target.files);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col w-full gap-y-4 flex-grow">
				<div className="flex flex-col md:flex-row gap-4">
					<Controller
						control={control}
						name="nameProduct"
						defaultValue=""
						render={({ field }) => (
							<TextField
								fullWidth
								label="Product Name"
								{...field}
								error={!!errors.nameProduct}
								helperText={errors.nameProduct?.message}
							/>
						)}
					/>
					<FormControl error={!!errors.productCategoryUuid} variant="outlined" fullWidth>
						<InputLabel id="product-category-label">Product Category</InputLabel>
						<Controller
							control={control}
							name="productCategoryUuid"
							defaultValue=""
							render={({ field }) => (
								<Select labelId="product-category-label" label="Product Category" {...field}>
									{productCategories.map((category) => (
										<MenuItem key={category.uuid} value={category.uuid}>
											{category.productCategoryName.charAt(0).toUpperCase() +
												category.productCategoryName.slice(1)}
										</MenuItem>
									))}
								</Select>
							)}
						/>
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
								onClick={handleImageUpload}
							>
								Upload
							</Button>
							<input
								hidden
								type="file"
								{...register("file")}
								ref={fileInputRef}
								onChange={handleFileChange}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-4 grow">
						<Controller
							control={control}
							name="stock"
							defaultValue=""
							render={({ field }) => (
								<TextField
									label="Stock"
									{...field}
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
							)}
						/>
						<Controller
							control={control}
							name="price"
							defaultValue=""
							render={({ field }) => (
								<TextField
									label="Price"
									{...field}
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
										startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
									}}
								/>
							)}
						/>
						<Controller
							control={control}
							name="desc"
							defaultValue=""
							render={({ field }) => (
								<TextField
									label="Description"
									{...field}
									error={!!errors.desc}
									helperText={errors.desc?.message}
									multiline
									rows={4}
									onKeyDown={(event) => {
										if (event.key === "Enter" && !event.shiftKey) {
											event.preventDefault();
											const textField = event.target;
											const { selectionStart, value } = textField;
											const newValue =
												value.substring(0, selectionStart) +
												"\n" +
												value.substring(textField.selectionEnd);
											textField.value = newValue;
											// Trigger the form validation manually
											setValue("desc", newValue);
										}
									}}
								/>
							)}
						/>
					</div>
				</div>
				<div className="inline-flex justify-end">
					<CustomButton type="submit" primary>
						Simpan Product
					</CustomButton>
				</div>
			</div>
		</form>
	);
}
