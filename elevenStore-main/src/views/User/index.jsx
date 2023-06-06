import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useSelector } from "react-redux";

export default function LayoutAccount() {
	const location = useLocation();
	const { user = {} } = useSelector((state) => state?.auth);

	const getLinkClass = (path) => {
		return classNames({
			"text-blue-500": location.pathname.startsWith(path),
			"hover:text-blue-700": !location.pathname.startsWith(path),
			"font-semibold": false,
		});
	};

	return (
		<>
			<div className="flex flex-row gap-2 bg-gray-200 p-2 px-4 text-gray-500 rounded shadow-sm">
				<Link to={`/user/account/profile`} className={getLinkClass("/user/account/profile")}>
					Profil
				</Link>
				{user?.role_category.roleName !== "admin" && (
					<>
						<span className="text-gray-300">|</span>
						<Link to={`/user/account/address`} className={getLinkClass("/user/account/address")}>
							Alamat
						</Link>
					</>
				)}
			</div>
			<div
				className={`mt-4 bg-white rounded shadow-sm ${
					location.pathname !== "/user/account/profile" ? "p-2 px-4" : ""
				}`}
			>
				<Outlet />
			</div>
		</>
	);
}
