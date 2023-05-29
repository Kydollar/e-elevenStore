import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "components/Cards";

export default function Products() {
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
		<div className="flex flex-wrap gap-2">
			<Cards products={products}/>
		</div>
	);
}
