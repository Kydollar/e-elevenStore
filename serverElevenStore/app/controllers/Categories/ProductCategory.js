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

export const updateProductCategory = async (req, res) => {
	const { productCategoryName, description } = req.body;
	const { uuid } = req.params;

	try {
		const existingCategory = await ProductCategory.findOne({
			where: { uuid: uuid },
		});

		if (!existingCategory) {
			return res.status(404).json({ msg: "Product category not found for the provided UUID" });
		}

		await ProductCategory.update(
			{
				productCategoryName: productCategoryName,
				description: description,
			},
			{ where: { uuid: uuid } }
		);

		res.status(200).json({ msg: "Product category updated successfully" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const deleteProductCategory = async (req, res) => {
	const { uuid } = req.params;

	try {
		const existingCategory = await ProductCategory.findOne({
			where: { uuid: uuid },
		});

		if (!existingCategory) {
			return res.status(404).json({ msg: "Product category not found for the provided UUID" });
		}

		await ProductCategory.destroy({
			where: { uuid: uuid },
		});

		res.status(200).json({ msg: "Product category deleted successfully" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
