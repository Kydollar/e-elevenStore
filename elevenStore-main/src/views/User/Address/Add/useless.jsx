import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TextField, MenuItem, InputAdornment } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import Button from "components/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	phoneNumber: yup
		.string()
		.matches(/^[0-9]+$/, "Phone number must only contain numbers")
		.required("Phone Number is required"),
	detailAddress: yup.string().required("Detail Address is required"),
});

function AddAddress() {
	const [provinces, setProvinces] = useState([]);
	const [cities, setCities] = useState([]);
	const [postalCode, setPostalCode] = useState(null);
	const [selectedProvince, setSelectedProvince] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [shippingCost, setShippingCost] = useState(null);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
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

	console.log(watch("phoneNumber"));

	useEffect(() => {
		// Fetch provinces data from RajaOngkir API
		axios
			.get(`${process.env.REACT_APP_HOST_API}/api/starter/province`)
			.then((response) => {
				setProvinces(response.data.rajaongkir.results);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		const selectedCityData = cities.find((city) => city.city_id === selectedCity);
		if (selectedCityData) {
			const postalCode = selectedCityData.postal_code;
			// Set the postal code for the selected city
			setPostalCode(postalCode);
		}
	}, [selectedCity]);

	// console.log(selectedCity);

	const handleProvinceChange = (e) => {
		const provinceId = e.target.value;
		setSelectedProvince(provinceId);
		// Fetch cities data based on the selected province from RajaOngkir API
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

	// const ekspedisi = async (data) => {
	// 	const origin = "54"; // ID of the origin city
	// 	const destination = selectedCity; // ID of the destination city
	// 	const weight = 192; // Weight of the package in grams
	// 	const courier = "jne"; // Shipping courier code

	// 	axios
	// 		.post(
	// 			`${process.env.REACT_APP_HOST_API}/api/starter/cost`,
	// 			{
	// 				origin,
	// 				destination,
	// 				weight,
	// 				courier,
	// 			},
	// 			{
	// 				headers: {
	// 					"Content-Type": "application/x-www-form-urlencoded",
	// 				},
	// 			}
	// 		)
	// 		.then((response) => {
	// 			console.log(response.data);
	// 			const results = response.data.rajaongkir.results;
	// 			if (results.length > 0) {
	// 				const shippingCost = results[0].costs[0].cost[0].value;
	// 				setShippingCost(shippingCost);
	// 			}
	// 			console.log("shipping", results);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// };

	const onSubmit = (data) => {
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("phoneNumber", data.phoneNumber);
			formData.append("province_id", selectedProvince);
			formData.append("city_id", selectedCity);
			formData.append("postalCode", postalCode);
			formData.append("detailAddress", data.detailAddress);
			formData.append("detailLainnya", data.detailLainnya);
			axios.post(`${process.env.REACT_APP_MY_API}/address-users`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire({
				title: "Berhasil",
				text: "Alamat berhasil ditambahkan, akan di arahkan ke halaman alamat!",
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
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
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
									}}
									inputProps={{
										maxLength: 14, // Adjust the maximum length as needed
										pattern: "^[0-9]*$",
										inputMode: "numeric",
									}}
								/>
							)}
						/>
						<Controller
							{...register("province_id")}
							control={control}
							defaultValue={!provinces && "loading"}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Provinsi"
									autoComplete="new-provinsi"
									error={!!errors.province_id}
									helperText={errors.province_id?.message}
									onChange={(e) => {
										field.onChange(e); // Trigger the onChange event for validation
										handleProvinceChange(e); // Call the handleProvinceChange function
									}}
								>
									{!provinces && <MenuItem value={"loading"}>Loading...</MenuItem>}
									{provinces.map((province, idx) => (
										<MenuItem key={province.province + idx} value={province.province_id}>
											{province.province.charAt(0).toUpperCase() + province.province.slice(1)}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							{...register("city_id")}
							control={control}
							defaultValue={!cities && "loading"}
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
						{/* <TextField
							label="PostalCode"
							{...register("postalCode")}
							error={!!errors.postalCode}
							helperText={errors.postalCode?.message}
							autoComplete="new-postalCode"
						/> */}
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
						{/* <Button type="button" onClick={() => "primaryAddress"} secondary>
							Utama
						</Button> */}
						{/* <button type="button" onClick={ekspedisi}>
							calculate
						</button> */}
						<div>
							<Button type="submit" primary>
								Simpan
							</Button>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}

export default AddAddress;
