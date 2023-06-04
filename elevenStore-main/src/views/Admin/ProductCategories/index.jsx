import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "components/Button";
import axios from "axios";
import Swal from "sweetalert2";

import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import MUIDataTable from "mui-datatables";

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
		name: "name",
		label: "Nama",
		options: {
			filter: true,
			sort: false,
		},
	},
	{
		name: "description",
		label: "Deskripsi",
		options: {
			filter: false,
			sort: false,
		},
	},
];

export default function CategoriesProduct() {
	const [categoriesProduct, setCategoriesProduct] = useState([]);

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
		getCategoriesProduct();
	}, []);

	const getCategoriesProduct = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_MY_API}/product-categories`);
			setCategoriesProduct(response.data);
		} catch (error) {
			console.log(error);
		}
	};

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
		}).then(async (result) => {
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
						setCategoriesProduct(categoriesProduct.filter((u) => u.uuid !== displayDataOnlyOne));
						try {
							await axios.delete(
								`${process.env.REACT_APP_MY_API}/product-categories/${displayDataOnlyOne}`
							);
							getCategoriesProduct();
						} catch (error) {
							console.log(error);
						}
					} else {
						let multiData;
						for (let i = 0; i < selectedRows.data.length; i++) {
							multiData = displayData[selectedRows.data[i].index].data[0];
							setCategoriesProduct(categoriesProduct.filter((u) => u.uuid !== multiData));
							try {
								await axios.delete(
									`${process.env.REACT_APP_MY_API}/product-categories/${multiData}`
								);
								getCategoriesProduct();
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
							<AddBoxRoundedIcon alt="Add Category" fontSize={"small"} />
							<p className="ml-2 cursor-pointer">Add Category</p>
						</div>
					</Button>
				</Link>
			</div>
			<ThemeProvider theme={getMuiTheme()}>
				<MUIDataTable
					title={"List of Product Categories"}
					data={categoriesProduct.map((e) => [e.uuid, e.productCategoryName, e.description])}
					columns={columns}
					options={options}
				/>
			</ThemeProvider>
		</div>
	);
}
