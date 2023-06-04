import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditProduct from "./editProduct";

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
				<h1 className="font-bold">User</h1>
				<h6 className="text-sm mt-1 opacity-60">Edit User</h6>
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
					<Tab label="Form" {...a11yProps(0)} />
				</Tabs>
			</AppBar>
			<SwipeableViews
				axis={theme.direction === "rtl" ? "x-reverse" : "x"}
				index={value}
				onChangeIndex={handleChangeIndex}
			>
				<Box className="mx-4 mt-8 mb-4" value={value} index={0} dir={theme.direction}>
					<EditProduct />
				</Box>
			</SwipeableViews>
		</Box>
	);
}
