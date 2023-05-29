import ProductCategory from "../../models/Categories/ProductCategory.js";
import Products from "../../models/ProductsModel.js";

export const getProductCategories = async (req, res) => {
	try {
		const response = await ProductCategory.findAll({
			attributes: ["uuid", "productCategoryName", "description"],
			include: { model: Products },
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getProductCategoryById = async (req, res) => {
	try {
		const response = await ProductCategory.findOne({
			attributes: ["uuid", "productCategoryName", "description"],
			where: {
				uuid: req.params.id,
			},
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getProductCategoryByName = async (req, res) => {
	try {
		const response = await ProductCategory.findOne({
			attributes: ["uuid", "productCategoryName", "description"],
			where: {
				productCategoryName: req.params.name,
			},
			include: { model: Products },
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const createProductCategory = async (req, res) => {
	const { productCategoryName, description } = req.body;
	try {
		await ProductCategory.create({
			productCategoryName: productCategoryName,
			description: description,
		});
		res.status(201).json({ msg: "Product Category Berhasil ditambahkan" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
