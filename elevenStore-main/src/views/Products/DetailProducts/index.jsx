import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatter } from "utils/useFormatter";
import { useSelector } from "react-redux";
import Button from "components/Button";
import Categories from "../Categories";

export default function DetailProducts() {
	const [productData, setProductData] = useState({});
	const [disabled, setDisabled] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const totalPrice = quantity * productData.price;

	useEffect(() => {
		if (!id) return;
		const getProduct = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/product/${id}`);
				setProductData(response.data);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getProduct();
	}, [id]);

	const handleCart = (product, redirect) => {
		if (user) {
			const apiUrl = `${process.env.REACT_APP_MY_API}/cart`;
			try {
				const formData = new FormData();
				formData.append("productUuid", product.uuid);
				formData.append("desc", "mock desc");
				formData.append("quantity", quantity);
				formData.append("subtotal", totalPrice);
				axios.post(apiUrl, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				if (redirect) {
					navigate("/cart");
				}
				console.log(product.uuid);
			} catch (error) {
				if (error.response) {
					console.log(error.response);
				}
			}
		} else {
			navigate("/login");
		}
	};

	return (
		<>
			<div className="mx-auto">
				<div className="flex flex-wrap">
					<div className="w-7/12">
						<img
							alt={productData?.nameProduct}
							className="w-full lg:h-auto h-64 object-contain object-center border border-gray-300 rounded-lg bg-white"
							src={productData?.imageUrl}
						/>
						<h2 className="text-2xl font-bold mb-2 mt-4">
							<a className="py-2" name="what">
								Dekripsi
							</a>
						</h2>
						<p className="mb-4">{productData?.desc}</p>
					</div>
					<div className="w-5/12 pl-4 pb-8">
						<div className="sticky top-20 border border-gray-300 p-4 rounded-lg bg-white">
							<h2 className="text-sm text-gray-500 tracking-widest uppercase">
								{productData?.product_category?.productCategoryName}
							</h2>
							<h1 className="text-gray-900 text-3xl font-medium mb-1">
								{productData?.nameProduct}
							</h1>
							<p className="leading-relaxed">{productData?.desc}</p>
							<div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5 gap-2">
								<div className="border border-gray-300 rounded-lg px-2">
									<button
										className={`${quantity > 1 ? "" : "disabled:opacity-40 cursor-not-allowed"}`}
										type="button"
										onClick={() => setQuantity(quantity - 1)}
										disabled={quantity > 1 ? false : true}
									>
										-
									</button>
									<span className="mx-4 text-sm">{quantity}</span>
									<button
										type="button"
										onClick={() => setQuantity(quantity + 1)}
										disabled={quantity < productData.stock ? false : true}
									>
										+
									</button>
								</div>
								<p>Stok: {productData.stock}</p>
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex justify-between items-center border-b-2 border-gray-100 pb-5">
									<span className="font-medium text-xl text-gray-500">Subtotal</span>
									<span className="font-medium text-2xl text-gray-900">
										{formatter.format(totalPrice)}
									</span>
								</div>
								<div className="flex flex-col gap-4">
									<Button
										inputClassName="justify-center items-center"
										onClick={() => handleCart(productData)}
										primary
									>
										Keranjang
									</Button>
									<Button
										inputClassName="justify-center items-center"
										onClick={() => handleCart(productData, true)}
										secondary
									>
										Beli
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h1 className="mb-2 font-bold">Product {productData?.product_category?.productCategoryName} lainnya</h1>
					<Categories uuidOnProduct={productData.uuid}/>
				</div>
			</div>
		</>
	);
}
