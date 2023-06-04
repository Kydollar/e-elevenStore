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
	name: yup.string().required("Name is required"),
	paymentName: yup.string().required("Name Payment is required"),
	norek: yup.string().required("Nomer Rekening is required"),
});

export default function EditPaymentMethod() {
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
			name: "",
			paymentName: "",
			norek: "",
		},
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		const getPaymentMethod = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/payment-methods/${uuid}`);
				const { name, paymentName, norek } = response.data;
				setValue("name", name);
				setValue("paymentName", paymentName);
				setValue("norek", norek);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.message);
				}
			}
		};
		getPaymentMethod();
	}, [uuid, setValue]);

	const onSubmit = async (data) => {
		console.log(data);
		try {
			await axios.put(`${process.env.REACT_APP_MY_API}/payment-methods/${uuid}`, data);
			Swal.fire({
				title: "Berhasil",
				text: "Payment Method berhasil diubah, akan diarahkan ke halaman payment method!",
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
				navigate("/admin/payment-method");
			});
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.message);
				Swal.fire({
					title: "Error",
					text: `An error occurred while edit the payment. ${error.response.data.msg}`,
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
						name="name"
						render={({ field }) => (
							<TextField
								{...field}
								label="Nama"
								error={!!errors.name}
								helperText={errors.name?.message}
								autoComplete="new-name"
							/>
						)}
					/>
					<Controller
						control={control}
						name="paymentName"
						render={({ field }) => (
							<TextField
								{...field}
								label="Nama Bank/Penyedia Layanan"
								error={!!errors.paymentName}
								helperText={errors.paymentName?.message}
								autoComplete="new-paymentName"
							/>
						)}
					/>
					<Controller
						control={control}
						name="norek"
						render={({ field }) => (
							<TextField
								{...field}
								label="Nomer Rekening"
								error={!!errors.norek}
								helperText={errors.norek?.message}
								autoComplete="new-norek"
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
