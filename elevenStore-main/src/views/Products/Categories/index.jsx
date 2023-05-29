import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cards from "components/Cards";

export default function Categories() {
	const [categoryData, setCategoryData] = useState([]);
	const { category } = useParams();

	useEffect(() => {
		if (!category) return;
		const getCategory = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/product-catalog/${category}`
				);
				setCategoryData(response.data);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data.msg);
				}
			}
		};
		getCategory();
	}, [category]);

	return (
		<div className="flex flex-wrap gap-2">
			<Cards products={categoryData.products} category={categoryData} />
		</div>
	);
}
