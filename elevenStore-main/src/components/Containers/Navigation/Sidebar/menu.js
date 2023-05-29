import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PaymentIcon from '@mui/icons-material/Payment';

export const menuAdmin = [
	{
		icon: <HomeOutlinedIcon />,
		title: "Dashboard",
		to: "/",
		items: [],
	},
	{
		icon: <LocalLibraryOutlinedIcon />,
		title: "Data Master",
		to: null,
		items: [
			{
				icon: <PeopleOutlineRoundedIcon fontSize="small" />,
				title: "Users",
				to: "/admin/users",
				items: [],
			},
			{
				icon: <PaymentIcon fontSize="small" />,
				title: "Payment Method",
				to: "/admin/payment-method",
				items: [],
			},
		],
	},
	{
		icon: <DescriptionOutlinedIcon />,
		title: "Product",
		to: "/admin/products",
	}
];
