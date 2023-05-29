import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TextField, MenuItem, InputAdornment, Divider } from "@mui/material";
import Button from "components/Button";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	phoneNumber: yup
		.string()
		.required("Phone Number is required")
		.matches(/^[0-9]+$/, "Phone number must only contain numbers"),
	detailAddress: yup.string().required("Detail Address is required"),
});

function EditAddress() {
	const [provinces, setProvinces] = useState([]);
	const [cities, setCities] = useState([]);
	const [postalCode, setPostalCode] = useState(null);
	const [selectedProvince, setSelectedProvince] = useState(
		provinces.length > 0 ? provinces[0].province_id : ""
	);
	const [selectedCity, setSelectedCity] = useState(cities.length > 0 ? cities[0].city_id : "");
	const navigate = useNavigate();
	const { addressId } = useParams();
	const location = useLocation();
	const { state = {} } = location;
	const uuid = state?.user?.uuid;

	const {
		register,
		handleSubmit,
		control,
		setValue,
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
		fetchAddress();
	}, []);

	useEffect(() => {
		const selectedCityData = cities.find((city) => city.city_id === selectedCity);
		if (selectedCityData) {
			const postalCode = selectedCityData.postal_code;
			setPostalCode(postalCode);
		}
	}, [selectedCity, cities]);

	const fetchProvinces = () => {
		axios
			.get(`${process.env.REACT_APP_HOST_API}/api/starter/province`)
			.then((response) => {
				setProvinces(response.data.rajaongkir.results);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const fetchCities = (provinceId) => {
        console.log(provinceId)
		axios
			.get(`${process.env.REACT_APP_HOST_API}/api/starter/city?province=${provinceId}`)
			.then((response) => {
				const citiesData = response.data.rajaongkir.results;
				setCities(citiesData);
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

	const fetchAddress = () => {
		axios
			.get(`${process.env.REACT_APP_MY_API}/address-users/${uuid}?addressUuid=${addressId}`)
			.then((response) => {
				const addressData = response.data;
				const { name, phoneNumber, province_id, city_id, detailAddress, detailLainnya } =
					addressData;
				setSelectedProvince(province_id);
				setSelectedCity(city_id);
                fetchCities(province_id);
				const updatedValues = {
					name,
					phoneNumber: phoneNumber.toString().substring(3), // remove "+62" prefix
					province_id,
					city_id,
					detailAddress,
					detailLainnya,
				};

				for (const key in updatedValues) {
					if (key in updatedValues) {
						const value = updatedValues[key];
						setValue(key, value);
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const onSubmit = async (data) => {
		try {
			const formData = {
				name: data.name,
				phoneNumber: parseInt(data.phoneNumber),
				province_id: selectedProvince,
				city_id: selectedCity,
				postalCode: postalCode,
				detailAddress: data.detailAddress,
				detailLainnya: data.detailLainnya,
			};

			await axios.put(`${process.env.REACT_APP_MY_API}/address-users/${addressId}`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			Swal.fire({
				title: "Berhasil",
				text: "Alamat berhasil diperbarui, akan diarahkan ke halaman alamat!",
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
				<h1>Form Edit Alamat</h1>
			</div>
			<Divider />
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 items-start justify-center my-6">
					<div className="flex flex-col w-full gap-y-4 flex-grow">
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
						{provinces.length > 0 && (
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
										{provinces.map((province, idx) => (
											<MenuItem key={province.province + idx} value={province.province_id}>
												{province.province.charAt(0).toUpperCase() + province.province.slice(1)}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						)}
						{cities.length > 0 && (
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
											<MenuItem key={city.city_name + idx} value={city.city_id}>
												{city.city_name.charAt(0).toUpperCase() + city.city_name.slice(1)}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						)}
						<Controller
							{...register("detailAddress")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Detail Alamat"
									error={!!errors.detailAddress}
									helperText={errors.detailAddress?.message}
									autoComplete="new-detailAddress"
								/>
							)}
						/>
						<Controller
							{...register("detailLainnya")}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Detail Lainnya (Patokan)"
									error={!!errors.detailLainnya}
									helperText={errors.detailLainnya?.message}
									autoComplete="new-detailLainnya"
								/>
							)}
						/>
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

export default EditAddress;
