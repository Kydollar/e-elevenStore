import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cards from "components/Cards";

export default function Categories(props) {
	const { uuidOnProduct } = props;
	const [categoryData, setCategoryData] = useState([]);
	const { category } = useParams();

	useEffect(() => {
		if (!category) return;
		const getCategory = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/product-catalog/${category}`
				);

				// Filter out products with the same UUID as uuidOnProduct
				const filteredProducts = response.data.products.filter(
					(product) => product.uuid !== uuidOnProduct
				);

				// Update the categoryData with the filtered products
				setCategoryData({ ...response.data, products: filteredProducts });
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getCategory();
	}, [category, uuidOnProduct]);

	return (
		<div className="flex flex-wrap gap-2">
			<Cards products={categoryData.products} category={categoryData} />
		</div>
	);
}
