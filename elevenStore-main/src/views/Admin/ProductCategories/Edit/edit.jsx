import React, { useState, useEffect } from "react";
import Button from "components/Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
	productCategoryName: yup.string().required("Name is required"),
	description: yup.string(),
});

export default function EditProductCategory() {
	const [msg, setMsg] = useState("");
	const { uuid } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		setValue,
	} = useForm({
		mode: "all",
		defaultValues: {
			productCategoryName: "",
			description: "",
		},
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		const getProductCategory = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/product-categories/${uuid}`
				);
				const { productCategoryName, description } = response.data;
				setValue("productCategoryName", productCategoryName);
				setValue("description", description);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.message);
				}
			}
		};
		getProductCategory();
	}, [uuid, setValue]);

	const onSubmit = async (data) => {
		console.log(data);
		try {
			await axios.put(`${process.env.REACT_APP_MY_API}/product-categories/${uuid}`, data);
			Swal.fire({
				title: "Berhasil",
				text: "Product category berhasil diubah, akan diarahkan ke halaman product category!",
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
				navigate("/admin/product-categories");
			});
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.message);
				Swal.fire({
					title: "Error",
					text: `An error occurred while editing the product category. ${error.response.data.msg}`,
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
			{msg && (
				<div className="alert alert-error" role="alert">
					{msg}
				</div>
			)}
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<Controller
						control={control}
						name="productCategoryName"
						render={({ field }) => (
							<TextField
								{...field}
								label="Nama"
								error={!!errors.productCategoryName}
								helperText={errors.productCategoryName?.message}
								autoComplete="new-productCategoryName"
							/>
						)}
					/>
					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<TextField
								{...field}
								label="Deskripsi"
								error={!!errors.description}
								helperText={errors.description?.message}
								autoComplete="new-description"
							/>
						)}
					/>
				</div>
			</div>
			<div className="mt-4">
				<Button type="submit" primary>
					Simpan
				</Button>
			</div>
		</form>
	);
}
