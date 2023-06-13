import Carousel from "components/Carousel";
import React, { useEffect, useState } from "react";
import Banner1 from "../../assets/images/banner-1.png";
import Banner2 from "../../assets/images/banner-2.png";
import Banner3 from "../../assets/images/banner-3.png";
import Cards from "components/Cards";
import axios from "axios";

const carouselData = [
	{
		title: "Iphone",
		desc: "",
		path: "/products/apple",
		image: Banner1,
	},
	{
		title: "Iphone",
		desc: "",
		path: "/products/apple",
		image: Banner2,
	},
	{
		title: "Samsung",
		desc: "",
		path: "/products/samsung",
		image: Banner3,
	},
];

const Dashboard = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_MY_API}/product`);
				setProducts(response.data);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getUser();
	}, []);
	return (
		<>
			<Carousel carouselData={carouselData} />
			<div className="flex flex-col">
				<h1 className="mt-4 font font-semibold">Produk Terbaru</h1>
				<div className="flex flex-wrap gap-2 mt-4">
					<Cards products={products} isCarousel={true} />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
