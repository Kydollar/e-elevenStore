import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import axios from "axios";

const schema = yup.object().shape({
	productCategoryName: yup.string().required("Name is required"),
	description: yup.string().required("Description is required"),
});

export default function ProductCategories() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			formData.append("productCategoryName", data.productCategoryName);
			formData.append("description", data.description);

			await axios.post(`${process.env.REACT_APP_MY_API}/product-categories`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			Swal.fire({
				title: "Success",
				text: "Product category created successfully! Redirecting to product categories page.",
				icon: "success",
				confirmButtonText: "Okay",
				allowOutsideClick: false,
				customClass: {
					confirmButton: "confirm",
				},
				buttonsStyling: false,
				timer: 2000,
				timerProgressBar: true,
			}).then(() => {
				// Redirect the user
				navigate("/admin/product-categories");
			});
		} catch (error) {
			if (error.response) {
				Swal.fire({
					title: "Error",
					text: `An error occurred while saving the product categories. ${error.response.data.msg}`,
					icon: "error",
					confirmButtonText: "OK",
					allowOutsideClick: false,
					customClass: {
						confirmButton: "confirm",
					},
					buttonsStyling: false,
				});
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<TextField
						label="Name"
						{...register("productCategoryName")}
						error={!!errors.productCategoryName}
						helperText={errors.productCategoryName?.message}
						autoComplete="new-productCategoryName"
					/>
					<TextField
						label="Description"
						{...register("description")}
						error={!!errors.description}
						helperText={errors.description?.message}
						autoComplete="new-description"
					/>
					<div>
						<Button type="submit" primary>
							Save
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
