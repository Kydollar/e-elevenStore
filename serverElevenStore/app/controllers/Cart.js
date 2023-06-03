import Cart from "../models/CartModel.js";
import ProductCategory from "../models/Categories/ProductCategory.js";
import Products from "../models/ProductsModel.js";
import Users from "../models/UserModel.js";

export const getCartByUserUuid = async (req, res) => {
	try {
		const { statusActive } = req.query;
		const cart = await Cart.findOne({
			where: {
				userUuid: req.params.userUuid,
			},
		});
		if (!cart) return res.status(404).json({ msg: "Keranjang tidak ditemukan" });

		let response;
		if (statusActive === "true" || statusActive === "false") {
			response = await Cart.findAll({
				attributes: ["uuid", "invoice", "productUuid", "userUuid", "desc", "quantity", "subtotal"],
				where: {
					userUuid: cart.userUuid,
					statusActive: statusActive === "true",
				},
				include: [
					{
						model: Products,
						attributes: [
							"uuid",
							"nameProduct",
							"productCategoryUuid",
							"imageUrl",
							"stock",
							"price",
						],
						include: [{ model: ProductCategory, attributes: ["productCategoryName"] }],
					},
					{
						model: Users,
						attributes: ["name", "email"],
					},
				],
			});
		} else {
			response = await Cart.findAll({
				attributes: ["uuid", "invoice", "productUuid", "userUuid", "desc", "quantity", "subtotal"],
				where: {
					userUuid: cart.userUuid,
				},
				include: [
					{
						model: Products,
						attributes: [
							"uuid",
							"nameProduct",
							"productCategoryUuid",
							"imageUrl",
							"stock",
							"price",
						],
						include: [{ model: ProductCategory, attributes: ["productCategoryName"] }],
					},
					{
						model: Users,
						attributes: ["name", "email"],
					},
				],
			});
		}

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const addCart = async (req, res) => {
	const { desc, quantity, subtotal, productUuid } = req.body;

	const generateUniqueRandomNumber = () => {
		const randomNumber = Math.floor(100000 + Math.random() * 900000);
		return randomNumber;
	};

	try {
		// Check if the product exists in the cart and is not checked out
		const existingCart = await Cart.findOne({
			where: {
				userUuid: req.session.userUuid,
				productUuid: productUuid,
				statusActive: true, // Only consider carts that are not checked out
			},
		});

		if (existingCart) {
			// If the cart exists, update its quantity and subtotal
			const updatedQuantity = existingCart.quantity + parseInt(quantity);
			const updatedSubtotal = existingCart.subtotal + parseInt(subtotal);

			await existingCart.update({
				quantity: updatedQuantity,
				subtotal: updatedSubtotal,
			});

			res.status(200).json({ msg: "Quantity produk berhasil diupdate di keranjang" });
		} else {
			// If the product is not in the cart or has been checked out, create a new cart item
			await Cart.create({
				userUuid: req.session.userUuid,
				invoice: "INV-" + generateUniqueRandomNumber() + Date.now(),
				productUuid: productUuid,
				desc: desc,
				quantity: quantity,
				subtotal: subtotal,
			});

			res.status(201).json({ msg: "Item berhasil ditambahkan ke keranjang" });
		}
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteByCartUuidUser = async (req, res) => {
	try {
		// Find the cart with the provided userUuid and cartUuid
		const cart = await Cart.findOne({
			where: {
				userUuid: req.session.userUuid,
				uuid: req.params.uuid,
			},
		});

		// If the cart doesn't exist or doesn't belong to the user, return a 404 error
		if (!cart) {
			return res.status(404).json({ msg: "Product tidak ditemukan" });
		}

		// Delete the cart
		await cart.destroy();

		res.status(200).json({ msg: "Product berhasil dihapus" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const updateCart = async (req, res) => {
	const { uuid } = req.params;
	const { statusActive, quantity } = req.body;

	try {
		// Find the cart item with the provided UUID
		const cart = await Cart.findOne({
			where: {
				uuid,
				userUuid: req.session.userUuid,
			},
			include: [Products], // Include the Products model to access product information
		});

		// If the cart item doesn't exist or doesn't belong to the user, return a 404 error
		if (!cart) {
			return res.status(404).json({ msg: "Cart item not found" });
		}

		// Update the statusActive and quantity of the cart item
		if (statusActive !== undefined) {
			cart.statusActive = statusActive;
		}
		if (quantity !== undefined) {
			cart.quantity = quantity;
			cart.subtotal = cart.product.price * quantity; // Recalculate the subtotal based on the updated quantity
		}

		await cart.save(); // Save the changes

		res.status(200).json({ msg: "Cart item updated successfully" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
