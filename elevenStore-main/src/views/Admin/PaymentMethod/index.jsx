import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "components/Button";
import axios from "axios";

import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import MUIDataTable from "mui-datatables";
import Swal from "sweetalert2";

import moment from "moment";
import "moment/locale/id"; // without this line it didn't work
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
		name: "category",
		label: "Category",
		options: {
			filter: true,
			sort: false,
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
		name: "stock",
		label: "Stock",
		options: {
			filter: false,
			sort: false,
		},
	},
];

export default function Products() {
	const [products, setProducts] = useState([]);

	const options = {
		selectableRowsHeader: false,
		responsive: "standard",
		customToolbarSelect: (selectedRows, displayData) => (
			<div className="flex gap-2 mr-6">
				{selectedRows.data.length <= 1 && (
					<Link
						to={`${displayData[selectedRows.data[0].index].data[0]}`}
						className="w-4 mx-1 transform hover:text-purple-500 hover:scale-110"
					>
						<ModeEditRoundedIcon alt="Edit" />
					</Link>
				)}
				<button
					onClick={() => {
						handleDelete(displayData, selectedRows);
					}}
					className="w-4 mx-1 transform hover:text-red-500 hover:scale-110"
				>
					<DeleteForeverRoundedIcon alt="Delete" fontSize={"small"} />
				</button>
			</div>
		),
	};

	useEffect(() => {
		getProducts();
	}, []);

	const getProducts = async () => {
		const response = await axios.get(`${process.env.REACT_APP_MY_API}/product`);
		setProducts(response.data);
	};

	console.log(products);

	const handleDelete = (displayData, selectedRows) => {
		Swal.fire({
			title: "Apakah anda yakin?",
			text: "Anda tidak akan dapat mengembalikan ini!",
			icon: "warning",
			showCancelButton: true,
			customClass: {
				confirmButton: "confirm",
				cancelButton: "cancel",
			},
			buttonsStyling: false,
			confirmButtonText: "Ya, hapus!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Behasil dihapus!",
					text: "Data berhasil dihapus.",
					icon: "success",
					customClass: {
						confirmButton: "confirm",
					},
					buttonsStyling: false,
				}).then(async () => {
					if (selectedRows.data.length <= 1) {
						const displayDataOnlyOne = displayData[selectedRows.data[0].index].data[0];
						setProducts(products.filter((u) => u.uuid !== displayDataOnlyOne));
						try {
							await axios.delete(`${process.env.REACT_APP_MY_API}/product/${displayDataOnlyOne}`);
							getProducts();
						} catch (error) {
							console.log(error);
						}
					} else {
						let multiData;
						for (let i = 0; i < selectedRows.data.length; i++) {
							multiData = displayData[selectedRows.data[i].index].data[0];
							setProducts(products.filter((u) => u.uuid !== multiData));
							try {
								await axios.delete(`${process.env.REACT_APP_MY_API}/product/${multiData}`);
								getProducts();
							} catch (error) {
								console.log(error);
							}
						}
					}
				});
			}
		});
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

	return (
		<div className="relative w-full h-full">
			<div className="flex justify-end items-center mb-2">
				<Link to={"add"}>
					<Button primary>
						<div className="inline-flex align-middle">
							<PersonAddRoundedIcon alt="Add User" fontSize={"small"} />
							<p className="ml-2 cursor-pointer">Tambah Product</p>
						</div>
					</Button>
				</Link>
			</div>
			<ThemeProvider theme={getMuiTheme()}>
				<MUIDataTable
					title={"Products"}
					data={products.map((e) => [
						e.uuid,
						e,
						e.product_category.productCategoryName,
						e.price,
						e.stock,
					])}
					columns={columns}
					options={options}
				/>
			</ThemeProvider>
		</div>
	);
}
