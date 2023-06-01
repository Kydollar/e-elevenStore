import React, { useState, useEffect } from "react";
import { InputBase, IconButton, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPage = ({ onSearch, handleClose }) => {
	const [searchText, setSearchText] = useState("");
	const [product, setProduct] = useState([]);
	const [msgError, setMsgError] = useState();

	const handleSearch = () => {
		onSearch(searchText);
	};

	const handleChange = (event) => {
		setSearchText(event.target.value);
	};

	const handleClear = () => {
		setSearchText("");
	};

	const handleKeyDown = (event) => {
		if (event.key === "Escape") {
			handleClose();
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			performSearch();
		}); // Adjust the delay (in milliseconds) according to your needs

		return () => {
			clearTimeout(timer);
		};
	}, [searchText]);

	const performSearch = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_MY_API}/product/search?q=${searchText}`
			);
			// Handle the response and perform any necessary actions
			setProduct(response.data);
			setMsgError(response.data.msg);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="fixed bg-white rounded-md shadow-md flex flex-col md:w-[50vw] w-[96vw] -translate-x-1/2 p-2">
			<div className="flex mb-2">
				<IconButton onClick={handleSearch}>
					<SearchIcon />
				</IconButton>
				<InputBase
					className="flex-1"
					placeholder="Search..."
					value={searchText}
					onChange={handleChange}
					sx={{ backgroundColor: "white", borderRadius: "4px", padding: "4px" }}
				/>
				{searchText && (
					<IconButton onClick={handleClear}>
						<ClearIcon />
					</IconButton>
				)}
				<span
					onClick={handleClose}
					className="text-sm text-gray-400 cursor-pointer text-center self-center p-2 border rounded bg-gray-100/50"
				>
					ESC
				</span>
			</div>
			<Divider />
			{msgError && (
				<div className="bg-white p-2 py-6 flex gap-4 justify-center items-center">
					<p className="text-gray-400 text-lg">{msgError}</p>
				</div>
			)}
			{Array.isArray(product) &&
				product.map((product) => (
					<Link
						to={`/products/${product?.product_category.productCategoryName}/${product?.uuid}`}
						key={product?.uuid}
						onClick={handleClose}
						className="bg-white p-2 flex gap-4 cursor-pointer justify-start items-center hover:bg-gray-100"
					>
						<img src={product?.imageUrl} className="w-16 h-16 object-cover bg-white" />
						<h1 className="cursor-pointer">{product?.nameProduct}</h1>
					</Link>
				))}
		</div>
	);
};

export default SearchPage;
