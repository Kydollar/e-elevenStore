import Button from "components/Button";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { formatter } from "utils/useFormatter";
import CustomModal from "components/Modal";
import Login from "views/Auth/Login/loginSecond";
import axios from "axios";

export default function Cards(props) {
	const { products, category } = props;
	const [openModalLogin, setOpenModalLogin] = useState(false);

	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const handleOpenLogin = () => {
		setOpenModalLogin(true);
	};

	const handleCloseLogin = () => {
		setOpenModalLogin(false);
	};

	const handleCart = (product, redirect) => {
		if (user) {
			const apiUrl = `${process.env.REACT_APP_MY_API}/cart`;

			try {
				const formData = new FormData();
				formData.append("productUuid", product.uuid);
				formData.append("desc", "mock desc");
				formData.append("quantity", 1);
				formData.append("subtotal", product.price);
				axios.post(apiUrl, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				if (redirect) {
					navigate("/cart");
				}
			} catch (error) {
				if (error.response) {
					console.log(error.response);
				}
			}
		} else {
			handleOpenLogin();
		}
	};

	return (
		<>
			{products?.map((product, index) => (
				<NavLink
					as="div"
					key={product?.uuid + index}
					to={{
						pathname: category
							? `${product?.uuid}`
							: `${product?.product_category?.productCategoryName}/${product?.uuid}`,
					}}
				>
					<div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow overflow-hidden">
						<div className="mb-4">
							<img
								className="w-[300px] h-[300px] object-cover object-center bg-white"
								src={product?.imageUrl}
								alt={product?.nameProduct}
							/>
						</div>
						<div className="px-5 pb-5">
							<div className="flex flex-col items-start justify-center">
								<h5 className="text-xl font-semibold tracking-tight text-gray-900">
									{product?.nameProduct}
								</h5>
								{category ? (
									<h4 className="text-md font-normal tracking-tight text-gray-500 hover:text-blue-900">
										{category?.productCategoryName.charAt(0).toUpperCase() +
											category.productCategoryName.slice(1)}
									</h4>
								) : (
									<Link
										to={{
											pathname: `${product?.product_category?.productCategoryName}`,
										}}
									>
										<h4 className="cursor-pointer text-md font-normal tracking-tight text-gray-500 hover:text-blue-900">
											{product?.product_category.productCategoryName.charAt(0).toUpperCase() +
												product?.product_category?.productCategoryName.slice(1)}
										</h4>
									</Link>
								)}
							</div>
							<div className="flex items-center mt-2.5 mb-5">
								<h4 className="text-md font-normal tracking-tight text-gray-500">
									Stok&nbsp;:&nbsp;
								</h4>
								<span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
									{product?.stock}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xl font-semibold text-gray-900">
									{formatter.format(product?.price)}
								</span>
								<Button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleCart(product);
									}}
									primary
								>
									+ Keranjang
								</Button>
							</div>
						</div>
					</div>
				</NavLink>
			))}
			<CustomModal open={openModalLogin} handleClose={handleCloseLogin}>
				{/* Modal Content */}
				<Login handleCloseLogin={handleCloseLogin} />
			</CustomModal>
		</>
	);
}
