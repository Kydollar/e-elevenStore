import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function ProtectedRoute(props) {
	const { role, children } = props;
	const navigate = useNavigate();
	const { isError, isLoading } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.auth);
	const [isUserRoleLoaded, setIsUserRoleLoaded] = useState(false);
	const userRole = user?.role_category?.roleName;

	useEffect(() => {
		let timeoutId;

		if (isError) {
			Swal.fire({
				icon: "error",
				html: "You don't have <b>access</b> to this page.",
				timer: 2000,
				timerProgressBar: true,
				showConfirmButton: false,
				backdrop: `linear-gradient(167deg, rgba(63,94,251,0.9) 0%, rgba(44,66,107,0.8979324640012255) 100%)`,
			}).then(() => {
				navigate("/");
			});
		} else if (!isUserRoleLoaded) {
			// User role is not loaded yet, show loading state
			return;
		} else if (role === "admin" && userRole !== "admin") {
			Swal.fire({
				icon: "error",
				html: "You don't have <b>access</b> to this page.",
				timer: 2000,
				timerProgressBar: true,
				showConfirmButton: false,
				backdrop: `linear-gradient(167deg, rgba(63,94,251,0.9) 0%, rgba(44,66,107,0.8979324640012255) 100%)`,
			}).then(() => {
				navigate("/");
			});
		} else if (role === "user" && userRole !== "user") {
			Swal.fire({
				icon: "error",
				html: "You don't have <b>access</b> to this page.",
				timer: 2000,
				timerProgressBar: true,
				showConfirmButton: false,
				backdrop: `linear-gradient(167deg, rgba(63,94,251,0.9) 0%, rgba(44,66,107,0.8979324640012255) 100%)`,
			}).then(() => {
				navigate("/");
			});
		}

		return () => clearTimeout(timeoutId);
	}, [role, userRole, isError, navigate, isUserRoleLoaded]);

	useEffect(() => {
		if (userRole) {
			setIsUserRoleLoaded(true);
		}
	}, [userRole]);

	if (!isUserRoleLoaded || isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred. Please try again later.</div>;
	}

	return children;
}
