import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatter } from "utils/useFormatter";
import { useSelector } from "react-redux";
import Button from "components/Button";

export default function DetailProducts() {
	const [productData, setProductData] = useState({});
	const [disabled, setDisabled] = useState(false)
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
							className="w-full lg:h-auto h-64 object-contain object-center rounded"
							src={productData?.imageUrl}
						/>
						<h2 className="text-2xl font-bold mb-2">
							<a className="py-2" name="what">
								What is Lorem Ipsum?
							</a>
						</h2>
						<p className="mb-4">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
							has been the industry's standard dummy text ever since the 1500s, when an unknown
							printer took a galley of type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into electronic typesetting,
							remaining essentially unchanged. It was popularised in the 1960s with the release of
							Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
							publishing software like Aldus PageMaker including versions of Lorem Ipsum.
						</p>
						<h2 className="text-2xl font-bold mb-2">
							<a className="py-2" name="where">
								Where does it come from?
							</a>
						</h2>
						<p className="mb-4">
							Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
							piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard
							McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
							the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going
							through the cites of the word in classical literature, discovered the undoubtable
							source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
							Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
							treatise on the theory of ethics, very popular during the Renaissance. The first line
							of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
						</p>
						<p className="mb-4">
							The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
							interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by
							Cicero are also reproduced in their exact original form, accompanied by English
							versions from the 1914 translation by H. Rackham.
						</p>
						<h2 className="text-2xl font-bold mb-2">
							<a className="py-2" name="why">
								Why do we use it?
							</a>
						</h2>
						<p className="mb-4">
							It is a long established fact that a reader will be distracted by the readable content
							of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
							more-or-less normal distribution of letters, as opposed to using 'Content here,
							content here', making it look like readable English. Many desktop publishing packages
							and web page editors now use Lorem Ipsum as their default model text, and a search for
							'lorem ipsum' will uncover many web sites still in their infancy. Various versions
							have evolved over the years, sometimes by accident, sometimes on purpose (injected
							humour and the like).
						</p>
						<h2 className="text-2xl font-bold mb-2">
							<a className="py-2" name="where2">
								Where can I get some?
							</a>
						</h2>
						<p className="mb-4">
							There are many variations of passages of Lorem Ipsum available, but the majority have
							suffered alteration in some form, by injected humour, or randomised words which don't
							look even slightly believable. If you are going to use a passage of Lorem Ipsum, you
							need to be sure there isn't anything embarrassing hidden in the middle of text. All
							the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as
							necessary, making this the first true generator on the Internet. It uses a dictionary
							of over 200 Latin words, combined with a handful of model sentence structures, to
							generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore
							always free from repetition, injected humour, or non-characteristic words etc.
						</p>
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
				<div className="bg-gray-200 py-36">
					<p className="text-center text-5xl font-bold">Footer</p>
				</div>
				<div className="bg-gray-200 py-36">
					<p className="text-center text-5xl font-bold">Footer</p>
				</div>
				<div className="py-3">
					<p className="text-center text-sm">
						made by{" "}
						<a
							href="https://stephenainsworth.com"
							className="underline hover:no-underline"
							target="_blank"
						>
							Stephen Ainsworth{" "}
						</a>
					</p>
				</div>
			</div>
			<div>
				<div className="bg-blue-500 flex">
					<div>
						<img
							alt={productData?.nameProduct}
							className="lg:w-1/2 w-full lg:h-auto max-h-[600px] h-64 object-contain object-center rounded"
							src={productData?.imageUrl}
						/>
					</div>
					<div></div>
					<div className="">
						<h2 className="text-sm text-gray-500 tracking-widest uppercase">
							{productData?.product_category?.productCategoryName}
						</h2>
						<h1 className="text-gray-900 text-3xl font-medium mb-1">{productData?.nameProduct}</h1>
						<p className="leading-relaxed">{productData?.desc}</p>
						<div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
							<div className="flex">Stok : {productData.stock}</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-2xl text-gray-900">
								{formatter.format(productData?.price)}
							</span>
							<div className=" flex">
								<button
									className="flex ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded mr-2"
									onClick={() => handleCart(productData, true)}
								>
									Beli
								</button>
								<button
									className="flex ml-auto border border-blue-500 py-2 px-6 focus:outline-none hover:bg-blue-600 hover:text-white rounded"
									onClick={() => handleCart(productData)}
								>
									Keranjang
								</button>
							</div>
							<button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
								<svg
									fill="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									className="w-5 h-5"
									viewBox="0 0 24 24"
								>
									<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
