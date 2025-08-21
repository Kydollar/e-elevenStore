import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TextField, MenuItem, InputAdornment, Divider } from "@mui/material";
import Button from "components/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	phoneNumber: yup
		.string()
		.required("Phone Number is required")
		.matches(/^[0-9]+$/, "Phone number must only contain numbers"),
	detailAddress: yup.string().required("Detail Address is required"),
});

function AddAddress() {
	const [provinces, setProvinces] = useState([]);
	const [cities, setCities] = useState([]);
	const [postalCode, setPostalCode] = useState(null);
	const [selectedProvince, setSelectedProvince] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "all",
		defaultValues: {
			name: "",
			phoneNumber: "",
			province_id: "",
			city_id: "",
			detailAddress: "",
			detailLainnya: "",
		},
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		fetchProvinces();
	}, []);

	useEffect(() => {
		const selectedCityData = cities.find((city) => String(city.id) === String(selectedCity));
		if (selectedCityData) {
			const postalCode = (selectedCityData.postal_code ?? selectedCityData.postalCode ?? selectedCityData.postal) || null;
			setPostalCode(postalCode);
		} else {
			setPostalCode(null);
		}
	}, [selectedCity, cities]);

	const fetchProvinces = () => {
		axios
			.get(`${process.env.REACT_APP_HOST_API}/api/v1/destination/province`)
			.then((response) => {
				console.log("response province", response);
				setProvinces(response.data.data || []);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const fetchCities = (provinceId) => {
		axios
			.get(`${process.env.REACT_APP_HOST_API}/api/v1/destination/city/${provinceId}`)
			.then((response) => {
				const citiesData = response.data.data;
				console.log("response city", response);

				setCities(citiesData || []);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleProvinceChange = (e) => {
		const provinceId = e.target.value;
		setSelectedProvince(provinceId);
		fetchCities(provinceId);
	};

	const onSubmit = async (data) => {
		try {
			const formData = {
				name: data.name,
				phoneNumber: parseInt(data.phoneNumber),
				province_id: selectedProvince,
				city_id: selectedCity,
				postalCode: postalCode ?? 17530,
				detailAddress: data.detailAddress,
				detailLainnya: data.detailLainnya,
			};

			await axios.post(`${process.env.REACT_APP_MY_API}/address-users`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			Swal.fire({
				title: "Berhasil",
				text: "Alamat berhasil ditambahkan, akan diarahkan ke halaman alamat!",
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
				navigate("/user/account/address");
			});
		} catch (error) {
			if (error.response) {
				console.log(error.response);
			}
		}
	};

	return (
		<div className="flex flex-col pt-2"> 
			<div className="flex justify-between items-center pb-4">
				<h1>Form Tambah Alamat</h1>
			</div>
			<Divider />
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 items-start justify-center my-6">
					<div className="flex flex-col w-full gap-y-4 flex-grow">
						<TextField
							label="Nama Penerima"
							{...register("name")}
							error={!!errors.name}
							helperText={errors.name?.message}
							autoComplete="new-name"
						/>
						<Controller
							control={control}
							{...register("phoneNumber")}
							render={({ field }) => (
								<TextField
									{...field}
									label="Phone Number"
									autoComplete="off"
									type="tel"
									error={!!errors.phoneNumber}
									helperText={errors.phoneNumber?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<span className="relative w-8 h-6 bg-white rounded border border-gray-500 after:bg-[#ce1126] after:w-full after:h-[11.5px] after:absolute after:rounded-t"></span>
												<span className="ml-2">+62</span>
											</InputAdornment>
										),
										maxLength: 14,
										pattern: "^[0-9]*$",
										inputMode: "numeric",
										onChange: (event) => {
											if (/^0/.test(event.target.value)) {
												event.target.value = event.target.value.replace(/^0/, "");
											}
											field.onChange(event);
										},
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
							{...register("province_id")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Provinsi"
									autoComplete="new-provinsi"
									error={!!errors.province_id}
									helperText={errors.province_id?.message}
									onChange={(e) => {
										field.onChange(e);
										handleProvinceChange(e);
									}}
								>
									{!provinces && <MenuItem value={"loading"}>Loading...</MenuItem>}
									{provinces.map((province, idx) => (
										<MenuItem key={province.id + idx} value={province.id}>
											{(province.name || "").charAt(0).toUpperCase() + (province.name || "").slice(1)}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							{...register("city_id")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Kota"
									autoComplete="new-kota"
									error={!!errors.city_id}
									helperText={errors.city_id?.message}
									onChange={(e) => {
										field.onChange(e);
										setSelectedCity(e.target.value);
									}}
								>
									{!cities && <MenuItem value={"loading"}>Loading...</MenuItem>}
									{cities.map((city, idx) => (
										<MenuItem key={(city.id || idx) + idx} value={city.id}>
											{(city.name || "").charAt(0).toUpperCase() + (city.name || "").slice(1)}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<TextField
							label="Detail Alamat"
							{...register("detailAddress")}
							error={!!errors.detailAddress}
							helperText={errors.detailAddress?.message}
							autoComplete="new-detailAddress"
						/>
						<TextField
							label="Detail Lainnya (Patokan)"
							{...register("detailLainnya")}
							error={!!errors.detailLainnya}
							helperText={errors.detailLainnya?.message}
							autoComplete="new-detailLainnya"
						/>
					</div>
					<div className="flex-shrink-0">
						<Button type="submit" primary>
							Tambahkan
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default AddAddress;
