import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { formatter } from "utils/useFormatter";
import Button from "components/Button";
import { Buffer } from "buffer";
import Swal from "sweetalert2";

import moment from "moment";
import "moment/locale/id"; // without this line it didn't work
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
moment.locale("id");

const columns = [
	{
		name: "uuid",
		label: "Uuid",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "invoice",
		label: "Invoice",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "userUuid",
		label: "User Uuid",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "product",
		label: "Product Item",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				return (
					<NavLink
						className="flex items-center hover:bg-gray-500/10 rounded-lg p-2 gap-2"
						to={{
							pathname: `../products/${value?.product_category?.productCategoryName}/${value?.uuid}`,
						}}
					>
						<img src={value?.imageUrl} alt="User" style={{ width: "50px", height: "50px" }} />
						<p className="font-semibold">{value?.nameProduct}</p>
					</NavLink>
				);
			},
		},
	},
	{
		name: "price",
		label: "Unit Price",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "quantity",
		label: "Qty",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "total",
		label: "Total",
		options: {
			filter: true,
			sort: false,
		},
	},
	{
		name: "action",
		label: "Aksi",
		options: {
			filter: true,
			sort: false,
			customBodyRender: (value) => {
				const handleDelete = async (uuid) => {
					try {
						if (!uuid) return;
						const confirmResult = await Swal.fire({
							title: "Konfirmasi",
							text: "Apakah Anda yakin ingin menghapus produk ini?",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: "Ya",
							cancelButtonText: "Batal",
							reverseButtons: true,
						});
						if (confirmResult.isConfirmed) {
							value.setCart(value.cart.filter((e) => e.uuid !== uuid));
							await axios.delete(`${process.env.REACT_APP_MY_API}/cart/delete/${uuid}`);

							Swal.fire({
								title: "Berhasil",
								text: "Produk berhasil dihapus dari keranjang",
								icon: "success",
							}).then(() => {
								// Perform additional action here
								// This block will be executed after the Swal.fire "Berhasil" dialog is closed
								if (value.cart.length <= 1) {
									window.location.reload(); // Refresh the page
								}
							});
						}
					} catch (error) {
						console.error("Error deleting cart:", error);
						Swal.fire({
							title: "Error",
							text: "Terjadi kesalahan saat menghapus produk dari keranjang",
							icon: "error",
						});
					}
				};
				return (
					<button className="hover:text-red-500" onClick={() => handleDelete(value.cartUuid)}>
						Hapus
					</button>
				);
			},
		},
	},
];

const Cart = () => {
	const [cart, setCart] = useState([]);
	const userUuid = useSelector((state) => state?.auth?.user?.uuid);
	const navigate = useNavigate();

	useEffect(() => {
		if (!userUuid) return;

		const getCart = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/cart/${userUuid}?statusActive=true`);
				setCart(response.data);
			} catch (error) {
				console.error("Error fetching cart:", error);
			}
		};

		getCart();
	}, [userUuid]);

	const handleCheckout = async (selectedRows) => {
		const selectedItems = selectedRows.data.map((row) => cart[row.index]);
		const encodedState = Buffer.from(JSON.stringify(selectedItems)).toString("base64");

		navigate(`/checkout/?state=${encodedState}`, { state: { selectedItems } });
	};

	const getMuiTheme = () =>
		createTheme({
			components: {
				MuiPaper: {
					styleOverrides: {
						root: {
							boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.03)",
							borderRadius: "0.5rem",
						},
					},
				},
				MUIDataTableToolbarSelect: {
					styleOverrides: {
						root: {
							padding: "14px 0px 14px 0px",
						},
					},
				},
			},
		});

	const options = {
		textLabels: {
			body: {
				noMatch: "Wah keranjang belanjaanmu kosong!",
			},
			selectedRows: {
				text: "produk dipilih",
				delete: "Delete",
				deleteAria: "Delete Selected Rows",
			},
		},
		selectableRowsHeader: true,
		responsive: "standard",
		search: false,
		download: false,
		viewColumns: false,
		filter: false,
		pagination: false,
		customToolbarSelect: (selectedRows, displayData) => {
			const selectedRowAmounts = [];
			const urutanTotal = 6;
			if (selectedRows.data.length <= 1) {
				parseInt(
					displayData[selectedRows?.data[selectedRows?.data?.length - 1]?.index]?.data[
						urutanTotal
					].replace(/\D/g, "")
				);
			} else {
				for (let i = 0; i < selectedRows.data.length; i++) {
					const amount = parseInt(
						displayData[selectedRows?.data[i]?.index]?.data[urutanTotal].replace(/\D/g, "")
					);

					if (!isNaN(amount)) {
						selectedRowAmounts.push({ index: selectedRows.data[i].index, amount: amount });
					}
				}
			}
			let totalAmount = selectedRowAmounts.reduce((sum, row) => sum + row.amount, 0);

			return (
				<>
					<div className="flex gap-2 mr-6 items-center">
						<span>
							Total harga:&nbsp;
							{selectedRows.data.length <= 1
								? displayData[selectedRows.data[0].index].data[urutanTotal]
								: formatter.format(totalAmount)}
						</span>
						<Button primary onClick={() => handleCheckout(selectedRows)}>
							Checkout
						</Button>
					</div>
				</>
			);
		},
	};

	return (
		<ThemeProvider theme={getMuiTheme()}>
			<MUIDataTable
				title={"Keranjang"}
				columns={columns}
				options={options}
				data={cart.map((e) => [
					e?.uuid,
					e?.invoice,
					e?.userUuid,
					e?.product,
					formatter.format(e?.product?.price),
					e?.quantity,
					formatter.format(e?.subtotal),
					{
						cartUuid: e?.uuid,
						cart,
						setCart,
					},
				])}
			/>
		</ThemeProvider>
	);
};

export default Cart;
