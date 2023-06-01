import React from "react";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import { Typography, Avatar, InputBase } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "components/Button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, reset } from "features/authSlice";
import ProfileMenu from "./profileMenu";
import CartMenu from "./cartMenu";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "components/Modal";
import Login from "views/Auth/Login/loginSecond";
import SearchIcon from "@mui/icons-material/Search";
import SearchPage from "./search";

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "16ch",
		},
	},
}));

function Topbar(props) {
	const { open, handleDrawerOpen } = props;
	const [anchorElProfile, setAnchorElProfile] = React.useState(null);
	const [anchorElCart, setAnchorElCart] = React.useState(null);
	const [cartLength, setCartLength] = React.useState(0);
	const [openModalLogin, setOpenModalLogin] = React.useState(false);
	const [openSearchModal, setOpenSearchModal] = React.useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	React.useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	const isProfileMenuOpen = Boolean(anchorElProfile);
	const isCartMenuOpen = Boolean(anchorElCart);

	const handleProfileMenuOpen = (event) => {
		setAnchorElProfile(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setAnchorElProfile(null);
	};

	const handleCartMenuOpen = (event) => {
		setAnchorElCart(event.currentTarget);
	};

	const handleCartMenuClose = () => {
		setAnchorElCart(null);
	};

	const handleOpenLogin = () => {
		setOpenModalLogin(true);
	};

	const handleCloseLogin = () => {
		setOpenModalLogin(false);
	};

	const handleSearchClick = () => {
		setOpenSearchModal(true);
	};

	const handleSearchClose = () => {
		setOpenSearchModal(false);
	};

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		navigate("/");
	};

	const profileMenuId = "profile-menu";
	const cartMenuId = "cart-menu";

	return (
		<>
			<AppBar
				position="fixed"
				open={open}
				className={`!bg-transparent bg-gradient-to-tr from-gray-800/30 to-blue-800/50 !shadow-md backdrop-blur-xl ${
					open && "rounded-l-xl"
				}`}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Search onClick={handleSearchClick}>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search products…"
							inputProps={{ "aria-label": "search" }}
							readOnly
						/>
					</Search>
					<Box sx={{ flexGrow: 1 }} />
					{user ? (
						<>
							<Box sx={{ display: { md: "flex" } }}>
								{user?.role_category?.roleName !== "admin" && (
									<IconButton
										size="large"
										aria-label="show shopping cart"
										onClick={handleCartMenuOpen}
										color="inherit"
									>
										<Badge badgeContent={cartLength} color="error">
											<ShoppingCartIcon />
										</Badge>
									</IconButton>
								)}
								<IconButton
									size="large"
									edge="end"
									aria-label="account of current user"
									aria-controls={profileMenuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit"
								>
									<Avatar
										src={user?.avatarUrl}
										alt={`${user?.name} Avatar`}
										sx={{ width: 26, height: 26 }}
									/>
								</IconButton>
							</Box>
						</>
					) : (
						<div className="inline-flex gap-2">
							<Button primary onClick={handleOpenLogin}>
								Masuk
							</Button>
							<Link to={"/register"} className="inline-flex">
								<Button secondary>Daftar</Button>
							</Link>
						</div>
					)}
				</Toolbar>
			</AppBar>
			<ProfileMenu
				anchorEl={anchorElProfile}
				isProfileMenuOpen={isProfileMenuOpen}
				handleProfileMenuClose={handleProfileMenuClose}
				logout={logout}
				profileMenuId={profileMenuId}
			/>
			<CartMenu
				anchorEl={anchorElCart}
				isCartMenuOpen={isCartMenuOpen}
				handleCartMenuClose={handleCartMenuClose}
				cartMenuId={cartMenuId}
				setCartLength={setCartLength}
			/>
			<CustomModal open={openModalLogin} handleClose={handleCloseLogin}>
				{/* Modal Content */}
				<Login handleCloseLogin={handleCloseLogin} />
			</CustomModal>
			<CustomModal open={openSearchModal} handleClose={handleSearchClose} onTop>
				<SearchPage handleClose={handleSearchClose} />
			</CustomModal>
		</>
	);
}

export default Topbar;
