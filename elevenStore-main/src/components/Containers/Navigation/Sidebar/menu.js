import React from "react";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';

export const menuAdmin = [
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
				title: "Payment Methods",
				to: "/admin/payment-method",
				items: [],
			},
			{
				icon: <CategoryIcon fontSize="small" />,
				title: "Product Categories",
				to: "/admin/product-categories",
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
