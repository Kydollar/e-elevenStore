import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, reset } from "features/authSlice";
import axios from "axios";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { useDispatch, useSelector } from "react-redux";
import { menuAdmin } from "./menu";
import { hasChildren } from "./utils";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CategoryIcon from "@mui/icons-material/Category";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const SingleLevel = ({ item, openSideBar, isActive }) => {
	return (
		<Link to={item?.to}>
			<div className={`${openSideBar && "mx-2 my-2"}`}>
				<ListItemButton
					style={{
						borderRadius: openSideBar ? "1rem" : undefined,
						backgroundColor: isActive ? "white" : undefined,
						boxShadow: isActive ? "0 20px 27px 0 rgba(0,0,0,.05)" : undefined,
					}}
					selected={isActive}
				>
					<ListItemIcon
						className={`mr-4 py-3 rounded-xl shadow-lg ${openSideBar ? "justify-center" : "pl-2"} ${
							isActive ? "bg-gradient-to-tl from-gray-800/30 to-blue-800/50 !text-gray-100" : ""
						}`}
					>
						{item?.icon}
					</ListItemIcon>
					<ListItemText primary={item?.title} />
				</ListItemButton>
			</div>
		</Link>
	);
};

const MultiLevel = ({ item, openSideBar, isActive }) => {
	const { items: children } = item;
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen((prev) => !prev);
	};

	return (
		<React.Fragment>
			<div className={`${openSideBar && "mx-2 my-2"}`}>
				<ListItemButton
					style={{
						borderRadius: openSideBar ? "1rem" : undefined,
						backgroundColor: open ? "white" : undefined,
						boxShadow: open ? "0 20px 27px 0 rgba(0,0,0,.05)" : undefined,
					}}
					onClick={handleClick}
					selected={isActive}
				>
					<ListItemIcon
						className={`mr-4 py-3 rounded-xl shadow-lg ${openSideBar ? "justify-center" : "pl-2"} ${
							open ? "bg-gradient-to-tl from-gray-800/30 to-blue-800/50 !text-gray-100" : ""
						}`}
					>
						{item?.icon}
					</ListItemIcon>
					<ListItemText primary={item?.title} />
					{open ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
				</ListItemButton>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{children.map((child, key) => (
							<MenuItem key={key} item={child} openSideBar={openSideBar} />
						))}
					</List>
				</Collapse>
			</div>
		</React.Fragment>
	);
};

const MenuItem = ({ item, openSideBar }) => {
	const location = useLocation();
	const isActive = location.pathname === item.to;
	const Component = hasChildren(item) ? MultiLevel : SingleLevel;
	return <Component item={item} openSideBar={openSideBar} isActive={isActive} />;
};

const Sidebar = (props) => {
	const { open } = props;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const [categoryData, setCategoryData] = useState();

	useEffect(() => {
		const getCategory = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/product-categories`);
				setCategoryData([
					{
						icon: <CategoryIcon />,
						title: "Kategori",
						to: null,
						items: response.data.map((ctg) => {
							return {
								icon: <FiberSmartRecordIcon fontSize="small" />,
								title:
									ctg.productCategoryName.charAt(0).toUpperCase() +
									ctg.productCategoryName.slice(1),
								to: `/products/${ctg.productCategoryName}`,
								items: [],
							};
						}),
					},
				]);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getCategory();
	}, []);

	const menuPublic = [
		{
			icon: <HomeOutlinedIcon />,
			title: "Dashboard",
			to: "/",
			items: [],
		},
		{
			icon: <PhoneIphoneIcon />,
			title: "Produk",
			to: "/products",
			items: [],
		},
	];

	const menuUser = [
		{
			icon: <ShoppingCartIcon />,
			title: "Keranjang",
			to: "/cart",
			items: [],
		},
		{
			icon: <WorkHistoryIcon />,
			title: "Billing History",
			to: "/billing-history",
			items: [],
		},
		{
			icon: <ReceiptIcon />,
			title: "Invoice",
			to: "/invoice",
			items: [],
		},
	];

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
	};
	return (
		<div className="flex flex-col justify-between h-screen bg-gray-100">
			<List>
				{user?.role_category?.roleName === "admin" ? (
					menuAdmin.map((item, key) => <MenuItem key={key} item={item} openSideBar={open} />)
				) : (
					<>
						{menuPublic?.map((item, key) => (
							<MenuItem key={key} item={item} openSideBar={open} />
						))}
						{categoryData?.map((item, key) => (
							<MenuItem key={key} item={item} openSideBar={open} />
						))}
						{user?.role_category?.roleName === "user" &&
							menuUser?.map((item, key) => <MenuItem key={key} item={item} openSideBar={open} />)}
					</>
				)}
			</List>
			{user ? (
				<button onClick={logout}>
					{!open && <Divider />}
					<div className={`${open && "mx-2 my-2"}`}>
						<ListItemButton
							style={{
								borderRadius: open ? "1rem" : ""
							}}
							selected={false}
						>
							<ListItemIcon
								className={`mr-4 py-3 rounded-xl shadow-lg ${open ? "justify-center" : "pl-2"}`}
							>
								<LogoutRoundedIcon />
							</ListItemIcon>
							<ListItemText primary={"Logout"} />
						</ListItemButton>
					</div>
				</button>
			) : null}
		</div>
	);
};

export default Sidebar;
