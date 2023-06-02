import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const titleStatic = "Eleven Store";
const descriptionStatic = "Phone Store";
const keywordsStatic = "Phone, Eleven Store, Hp";
const iconPath = "/path/to/icon.png"; // Update with the path to your custom icon file

export default function Metatags(props) {
	const { category } = props;
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { pathname } = useLocation();

	useEffect(() => {
		let titleDynamic = "";
		let descriptionDynamic = "";

		if (pathname.startsWith("/products")) {
			titleDynamic = "Products";
			descriptionDynamic = "Products elektronik handphone";
			if (pathname.startsWith(`/products/${category}`)) {
				titleDynamic = `${capitalizeFirstLetter(category)}`;
				descriptionDynamic = `Check out our latest ${category} products`;
			}
		} else if (pathname.startsWith("/cart")) {
			titleDynamic = "Keranjang";
			descriptionDynamic = "Keranjang elektronik handphone";
		} else if (pathname.startsWith("/checkout")) {
			titleDynamic = "Checkout";
			descriptionDynamic = "Checkout elektronik handphone";
		} else if (pathname.startsWith("/billing-history")) {
			titleDynamic = "Billing History";
			descriptionDynamic = "Billing History elektronik handphone";
		} else if (pathname.startsWith("/invoice")) {
			titleDynamic = "Invoice";
			descriptionDynamic = "Invoice elektronik handphone";
		} else if (pathname.startsWith("/user/account")) {
			titleDynamic = "Akun";
			descriptionDynamic = "Akun elektronik handphone";
		}

		setTitle(titleDynamic);
		setDescription(descriptionDynamic);
	}, [pathname, category]);

	const capitalizeFirstLetter = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<Helmet>
			<title>{`${title ? `${title} - ` : ""}${titleStatic}`}</title>
			<meta name="description" content={`${descriptionStatic}, ${description}`} />
			<meta name="keywords" content={keywordsStatic} />
			<link rel="icon" type="image/png" href={iconPath} />
		</Helmet>
	);
}
