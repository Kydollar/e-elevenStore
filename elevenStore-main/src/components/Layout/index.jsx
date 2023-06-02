import { useState, useEffect } from "react";
import Topbar from "../Containers/Navigation/Topbar";
import Sidebar from "../Containers/Navigation/Sidebar";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import useWindowSize from "hooks/useWindowSize";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useDispatch } from "react-redux";
import { getMe, reset } from "features/authSlice";
import Metatags from "components/MetaTags";

const drawerWidth = 280;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
	border: "none",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	[theme.breakpoints.down(900)]: {
		width: 0,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		...(open && {
			...openedMixin(theme),
			"& .MuiDrawer-paper": openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			"& .MuiDrawer-paper": closedMixin(theme),
		}),
	})
);

const Layout = () => {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [scrollNav, setScrollNav] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(!open);
	};
	const size = useWindowSize();
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMe());
		dispatch(reset());
	}, [dispatch]);

	useEffect(() => {
		const changeColorNav = () => {
			if (window.scrollY >= 80) {
				setScrollNav(true);
			} else {
				setScrollNav(false);
			}
		};

		window.addEventListener("scroll", changeColorNav);
	}, []);
	return (
		<React.Fragment>
			<Metatags />
			<span className="fixed w-[40vw] h-[40vh] bg-blue-300/10 rounded-full left-[400%] top-[50%] -z-10 blur-3xl"></span>
			<span className="fixed w-[40vw] h-[40vh] bg-blue-300/10 rounded-full left-[50%] top-[30%] -z-10 blur-3xl"></span>
			<span className="fixed w-[40vw] h-[40vh] bg-gray-300/10 rounded-full left-[30%] top-[20%] -z-10 blur-3xl"></span>
			<Box
				sx={
					size.width <= 900
						? null
						: !open
						? {
								marginLeft: 8,
								transition: theme.transitions.create("margin-left", {
									easing: theme.transitions.easing.sharp,
									duration: theme.transitions.duration.leavingScreen,
								}),
						  }
						: {
								marginLeft: `${drawerWidth}px`,
								transition: theme.transitions.create("margin-left", {
									easing: theme.transitions.easing.sharp,
									duration: theme.transitions.duration.enteringScreen,
								}),
						  }
				}
			>
				<Topbar open={open} handleDrawerOpen={handleDrawerOpen} scrollNav={scrollNav} />
				<CssBaseline />

				<Drawer variant="permanent" open={open}>
					<DrawerHeader className="bg-gray-100">
						<div className="flex w-full pl-3">
							{/* <img src={Logo} alt="logo" className="bg-blue-500 mr-6 w-4 h-4" />
							<Typography>{scrollNav ? "BSI" : "Brantas"}</Typography> */}
							ELEVEN STORE
						</div>
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</DrawerHeader>
					<Divider />
					<Sidebar open={open} />
				</Drawer>

				<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
					<DrawerHeader />
					{<Outlet />}
				</Box>
			</Box>
		</React.Fragment>
	);
};

export default Layout;
