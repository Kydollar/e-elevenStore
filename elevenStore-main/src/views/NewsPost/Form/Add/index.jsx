// import React from "react";
// import Layout from "components/Layout";
// // import { UserSquare } from "phosphor-react";
// import Button from "components/Button";

// export default function AddNews() {
// 	return (
// 			<div className="relative w-full h-full px-4 py-4">
// 				<div className="p-4 bg-white shadow-md rounded-lg">
// 					<h1 className="font-bold">News</h1>
// 					<h6 className="text-sm mt-1 opacity-60">Add News Post</h6>
// 				</div>
// 				<div className="w-full mt-4">
// 					<form className="p-4 bg-white shadow-md rounded-lg">
// 						<div className="flex flex-col">
// 							<div className="mb-5">
// 								<label htmlFor="Judul" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Judul
// 								</label>
// 								<input
// 									type="text"
// 									name="Judul"
// 									id="Judul"
// 									placeholder="Judul"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Slug" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Slug
// 								</label>
// 								<input
// 									type="text"
// 									name="Slug"
// 									id="Slug"
// 									placeholder="Slug"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="Role" className="mb-3 block text-base font-medium text-[#07074D]">
// 									News Kategori
// 								</label>
// 								<select
// 									defaultValue={"default"}
// 									id="Role"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								>
// 									<option value="default">Pilih Kategori</option>
// 									<option value="">Security</option>
// 								</select>
// 							</div>
// 							<div className="mb-5">
// 								<label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
// 									Tanggal Publikasi
// 								</label>
// 								<input
// 									type="date"
// 									name="date"
// 									id="date"
// 									className="w-full rounded-md border border-[#e0e0e0] bg-white py-2.5 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// 								/>
// 							</div>
// 						</div>
// 						<div>
// 							<Button inputClassName="bg-blue-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all">
// 								Publikasi
// 							</Button>
// 						</div>
// 					</form>
// 				</div>
// 			</div>
// 	);
// }

import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddNews from "./add";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	};
}

export default function FullWidthTabs() {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	return (
		<Box sx={{ borderRadius: "8px" }} className="bg-white shadow-md mt-2">
			<div className="p-4 bg-gradient-to-br from-sky-700 to-sky-500 shadow-md rounded-t-lg text-white">
				<h1 className="font-bold">News</h1>
				<h6 className="text-sm mt-1 opacity-60">Add News Post</h6>
			</div>
			<AppBar
				position="static"
				className="rounded-t-lg font-bold !bg-transparent !border !shadow-md"
			>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="fullWidth"
					aria-label="full width tabs example"
				>
					<Tab label="Formulir" {...a11yProps(0)} />
				</Tabs>
			</AppBar>
			<SwipeableViews
				axis={theme.direction === "rtl" ? "x-reverse" : "x"}
				index={value}
				onChangeIndex={handleChangeIndex}
			>
				<Box className="mx-4 mt-8 mb-4" value={value} index={0} dir={theme.direction}>
					<AddNews />
				</Box>
			</SwipeableViews>
		</Box>
	);
}
