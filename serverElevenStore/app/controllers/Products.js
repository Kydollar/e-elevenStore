import path from "path";
import fs from "fs";
import Products from "../models/ProductsModel.js";
import ProductCategory from "../models/Categories/ProductCategory.js";

export const getProducts = async (req, res) => {
	try {
		let response;
		response = await Products.findAll({
			attributes: [
				"uuid",
				"nameProduct",
				"slug",
				"image",
				"imageUrl",
				"desc",
				"createdAt",
				"updatedAt",
				"productCategoryUuid",
				"stock",
				"price",
			],
			include: [
				{
					model: ProductCategory,
					attributes: ["productCategoryName", "description"],
				},
			],
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const postProduct = await Products.findOne({
			where: {
				uuid: req.params.id,
			},
		});
		if (!postProduct) return res.status(404).json({ msg: "Data tidak ditemukan" });
		let response;
		response = await Products.findOne({
			attributes: [
				"uuid",
				"nameProduct",
				"slug",
				"image",
				"imageUrl",
				"desc",
				"createdAt",
				"updatedAt",
				"productCategoryUuid",
				"stock",
				"price",
			],
			where: {
				uuid: postProduct.uuid,
			},
			include: [
				{
					model: ProductCategory,
					attributes: ["productCategoryName", "description"],
				},
			],
		});

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const createProduct = async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0)
		return res.status(400).json({ msg: "No files were uploaded." });
	const file = req.files.file;
	const fileSize = file.data.length;
	const ext = path.extname(file.name);
	const fileName = file.md5 + Date.now() + ext;
	const imageUrl = `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
	const allowedType = [".png", ".jpg", ".jpeg"];
	const { nameProduct, slug, desc, productCategoryUuid, stock, price } = req.body;

	if (!allowedType.includes(ext.toLowerCase()))
		return res.status(422).json({ msg: "Invalid Images" });
	if (fileSize > 5000000) return res.status(422).json({ msg: "Maksimal file gambar yaitu 5 MB" });

	try {
		await Products.create({
			nameProduct: nameProduct,
			slug: slug,
			image: fileName,
			imageUrl: imageUrl,
			desc: desc,
			productCategoryUuid: productCategoryUuid,
			stock: stock,
			price: price,
		});
		file.mv(`./public/images/products/${fileName}`, async (err) => {
			if (err) return res.status(500).json({ msg: err.message });
		});
		res.status(201).json({
			msg: "Product berhasil dibuat",
			// file: file.md5,
			// fileSize: fileSize,
			// ext: ext,
			// fileName: fileName,
			// imageUrl: imageUrl,
		});
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const updateProduct = async (req, res) => {};

export const deleteProduct = async (req, res) => {};
