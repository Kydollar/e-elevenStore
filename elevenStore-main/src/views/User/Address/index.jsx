import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";

export default function Address() {
	const [address, setAddress] = useState([]);
	const [msg, setMsg] = useState("");
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	useEffect(() => {
		if (!user?.uuid) return;
		const getAddress = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/address-users/${user?.uuid}`
				);
				setAddress(response.data);
			} catch (error) {
				if (error.response) {
					setMsg(error.response.data.msg);
				}
			}
		};
		getAddress();
	}, [user]);

	const sortedAddresses = [...address].sort((a, b) => {
		if (a.primaryAddress && !b.primaryAddress) {
			return -1;
		}
		if (!a.primaryAddress && b.primaryAddress) {
			return 1;
		}
		return 0;
	});

	const handleSetPrimaryAddress = (addressId) => {
		axios
			.put(`${process.env.REACT_APP_MY_API}/address-users/${addressId}/primary`)
			.then((response) => {
				console.log(response.data.msg); // Display success message in the console or perform other actions
				refreshAddress();
			})
			.catch((error) => {
				console.error(error); // Handle errors if they occur
			});
	};

	const handleDeleteAddress = (addressId) => {
		// Show a confirmation dialog
		Swal.fire({
			title: "Apakah Anda yakin?",
			text: "Alamat akan dihapus secara permanen.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus",
			cancelButtonText: "Batal",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				// User confirmed the deletion
				axios
					.delete(`${process.env.REACT_APP_MY_API}/address-users/${addressId}`)
					.then((response) => {
						console.log(response.data.msg); // Display success message in the console or perform other actions
						refreshAddress(); // Refresh the address list after deletion
					})
					.catch((error) => {
						console.error(error); // Handle errors if they occur
					});
			}
		});
	};

	const refreshAddress = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_MY_API}/address-users/${user?.uuid}`
			);
			setAddress(response.data);
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};
	return (
		<div className="flex flex-col pt-2">
			<div className="flex justify-between items-center pb-4">
				<h1>Alamat Saya</h1>
				<Button onClick={() => navigate("add-address")} primary>
					+&nbsp;Tambah Alamat Baru
				</Button>
			</div>
			<Divider />
			{!msg ? (
				sortedAddresses.map((a, idx) => (
					<div key={a.uuid + idx} className="flex justify-between items-center gap-4 my-6">
						<div className="block">
							<div className="inline-flex gap-2 justify-center items-center">
								<h1>{a.name}</h1> <span className="text-gray-500/50">|</span>
								<p className="text-gray-500">{a.phoneNumber}</p>
							</div>
							<div className="flex flex-col gap-2 items-start">
								<p className="text-gray-500 text-sm">{a.detailAddress}</p>
								{a.primaryAddress ? (
									<span className="border border-blue-500 text-blue-500 py-1 px-2 text-sm rounded">
										Utama
									</span>
								) : (
									<span className="border border-gray-500/50 text-gray-500/50 py-1 px-2 text-sm rounded">
										Utama
									</span>
								)}
							</div>
						</div>
						<div className="flex flex-col items-end justify-center gap-2">
							<div className="flex gap-2">
								<button
									className="text-sm px-2 hover:text-blue-500"
									onClick={() =>
										navigate(`${a.uuid}`, {
											state: {
												user,
											},
										})
									}
								>
									Ubah
								</button>
								{!a.primaryAddress && (
									<>
										<span className="text-gray-500/50">|</span>
										<button
											className="text-sm px-2 hover:text-red-500"
											onClick={() => handleDeleteAddress(a.uuid)}
										>
											Hapus
										</button>
									</>
								)}
							</div>
							{!a.primaryAddress && (
								<Button onClick={() => handleSetPrimaryAddress(a.uuid)} secondary>
									Atur Sebagai Utama
								</Button>
							)}
						</div>
					</div>
				))
			) : (
				<div className="my-6 text-center">
					Anda tidak memiliki alamat mohon untuk menambahkan alamat agar dapat melanjutkan belanja
				</div>
			)}
		</div>
	);
}
