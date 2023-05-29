import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "features/authSlice";

function ProfileMenu(props) {
	const { anchorElProfile, isProfileMenuOpen, handleProfileMenuClose } = props;
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		handleProfileMenuClose();
		navigate("/");
	};

	return (
		<Menu
			anchorEl={anchorElProfile}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			id="profile-menu"
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
		>
			<Link to={`user/account/profile`}>
				<MenuItem onClick={handleProfileMenuClose}>
					<div className="flex gap-4 items-center">
						<Avatar src={user?.avatarUrl} alt={`${user?.name} Avatar`} sx={{ width: 32, height: 32 }} />
						<h1 className="cursor-pointer">{user?.name}</h1>
					</div>
				</MenuItem>
			</Link>
			<Divider></Divider>
			<div className="mt-2">
				<Link to={`user/account/profile`}>
					<MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
				</Link>
				{user?.role_category?.roleName !== "admin" && (
					<Link to={`user/account/address`}>
						<MenuItem onClick={handleProfileMenuClose}>Alamat Saya</MenuItem>
					</Link>
				)}
				<MenuItem onClick={logout}>Log Out</MenuItem>
			</div>
		</Menu>
	);
}

export default ProfileMenu;
