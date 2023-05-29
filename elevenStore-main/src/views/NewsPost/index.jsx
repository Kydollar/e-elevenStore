import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "components/Button";
import MUIDataTable from "mui-datatables";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
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
			filter: true,
			sort: false,
		},
	},
	{
		name: "title",
		label: "Judul",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "author",
		label: "Author",
		options: {
			filter: true,
			sort: false,
		},
	},
];

export default function NewsPost() {
	const [posts, setPosts] = useState([]);

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
						<ModeEditRoundedIcon alt="Edit News" />
					</Link>
				)}
				<Link
					onClick={() => {
						handleDelete(displayData, selectedRows);
					}}
					className="w-4 mx-1 transform hover:text-red-500 hover:scale-110"
				>
					<DeleteForeverRoundedIcon alt="Delete News" fontSize={"small"} />
				</Link>
			</div>
		),
	};
	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = async () => {
		const response = await axios.get(`${process.env.REACT_APP_MY_API}/news`);
		setPosts(response.data);
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
						setPosts(posts.filter((u) => u.uuid !== displayDataOnlyOne));
						try {
							await axios.delete(`${process.env.REACT_APP_MY_API}/news/${displayDataOnlyOne}`);
							getPosts();
						} catch (error) {
							console.log(error);
						}
					} else {
						let multiData;
						for (let i = 0; i < selectedRows.data.length; i++) {
							multiData = displayData[selectedRows.data[i].index].data[0];
							setPosts(posts.filter((u) => u.uuid !== multiData));
							try {
								await axios.delete(`${process.env.REACT_APP_MY_API}/news/${multiData}`);
								getPosts();
							} catch (error) {
								console.log(error);
							}
						}
					}
				});
			}
		});
	};
	return (
		<div className="relative w-full h-full mt-2">
			<div className="p-4 bg-gradient-to-br from-sky-700 to-sky-500 shadow-md rounded-lg mb-2 text-white">
				<h1 className="font-bold">News</h1>
				<h6 className="text-sm mt-1 opacity-60">News Post</h6>
			</div>
			<div className="flex justify-end items-center py-2">
				<Link to={"/news/add"} className="inline-flex">
					<Button inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:-translate-x-0.5 transition-all">
						<PersonAddRoundedIcon alt="Add User" fontSize={"small"} />
						<p className="ml-2">Tambah News Post</p>
					</Button>
				</Link>
			</div>
			<MUIDataTable
				title={"News List"}
				data={posts.map((e) => [
					e.uuid,
					`/news/edit/${e.uuid}`,
					moment(e.createdAt).format("dddd, D MMMM YYYY"),
					e.name,
					e.user.name,
				])}
				columns={columns}
				options={options}
			/>
		</div>
	);
}
