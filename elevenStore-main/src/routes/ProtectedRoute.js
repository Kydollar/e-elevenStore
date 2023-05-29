import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute(props) {
	const { admin, children } = props;
	const navigate = useNavigate();
	const { isError, isLoading } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.auth);
	const userRole = user?.role_category?.roleName;

	useEffect(() => {
		let timeoutId;

		if (admin && userRole !== "admin") {
			timeoutId = setTimeout(() => {
				navigate("/");
			}, 1000); // 5 seconds
		}

		return () => clearTimeout(timeoutId);
	}, [admin, userRole]);

	useEffect(() => {
		if (isError) {
			navigate("/");
		}
	}, [isError, navigate]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred. Please try again later.</div>;
	}

	return children;
}
