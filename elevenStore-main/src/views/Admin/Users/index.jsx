import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
		name: "to",
		label: "Link",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "createdAt",
		label: "Tanggal Posting",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "username",
		label: "Username",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "name",
		label: "Name",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "email",
		label: "Email",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "role",
		label: "Role",
		options: {
			filter: true,
			sort: false,
		},
	},
];

export default function Users() {
	const [users, setUsers] = useState([]);

	const options = {
		selectableRowsHeader: false,
		responsive: "standard",
		customToolbarSelect: (selectedRows, displayData) => (
			<div className="flex gap-2 mr-6">
				{selectedRows.data.length <= 1 && (
					<Link
						to={`${displayData[selectedRows.data[0].index].data[1]}`}
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
					<DeleteForeverRoundedIcon alt="Delete User" fontSize={"small"} />
				</button>
			</div>
		),
	};

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		const response = await axios.get(`${process.env.REACT_APP_MY_API}/users`);
		setUsers(response.data);
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
						setUsers(users.filter((u) => u.uuid !== displayDataOnlyOne));
						try {
							await axios.delete(`${process.env.REACT_APP_MY_API}/users/${displayDataOnlyOne}`);
							getUsers();
						} catch (error) {
							console.log(error);
						}
					} else {
						let multiData;
						for (let i = 0; i < selectedRows.data.length; i++) {
							multiData = displayData[selectedRows.data[i].index].data[0];
							setUsers(users.filter((u) => u.uuid !== multiData));
							try {
								await axios.delete(`${process.env.REACT_APP_MY_API}/users/${multiData}`);
								getUsers();
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
							<p className="ml-2 cursor-pointer">Tambah User</p>
						</div>
					</Button>
				</Link>
			</div>
			<ThemeProvider theme={getMuiTheme()}>
				<MUIDataTable
					title={"Users List"}
					data={users.map((e) => [
						e.uuid,
						`edit/${e.uuid}`,
						moment(e.createdAt).format("dddd, D MMMM YYYY"),
						e.username,
						e.name,
						e.email,
						e.role_category.roleName,
					])}
					columns={columns}
					options={options}
				/>
			</ThemeProvider>
		</div>
	);
}
