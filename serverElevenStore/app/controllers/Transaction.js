import moment from "moment-timezone";
import Transaction from "../models/TransactionModel.js";
import Products from "../models/ProductsModel.js";
import ProductCategory from "../models/Categories/ProductCategory.js";
import Users from "../models/UserModel.js";
import Cart from "../models/CartModel.js";
import PaymentMethod from "../models/PaymentMethodModel.js";
import Address from "../models/AddressModel.js";
import ProofOfPayment from "../models/ProofOfPaymentModel.js";

// export const getCheckoutByUserUuid = async (req, res) => {
// 	// try {
// 	// 	const checkout = await Transaction.findOne({
// 	// 		where: {
// 	// 			userUuid: req.params.userUuid,
// 	// 		},
// 	// 	});
// 	// 	if (!checkout) return res.status(404).json({ msg: "Checkout tidak ditemukan" });
// 	// 	let response;
// 	// 	response = await Transaction.findAll({
// 	// 		attributes: ["uuid", "invoice", "chartUuid", "userUuid", "desc", "quantity", "subtotal"],
// 	// 		where: {
// 	// 			userUuid: checkout.userUuid,
// 	// 		},
// 	// 		include: [
// 	// 			{
// 	// 				model: Products,
// 	// 				attributes: ["uuid", "nameProduct", "productCategoryUuid", "imageUrl", "stock", "price"],
// 	// 				include: [{ model: ProductCategory, attributes: ["productCategoryName"] }],
// 	// 			},
// 	// 			{
// 	// 				model: Users,
// 	// 				attributes: ["name", "email"],
// 	// 			},
// 	// 		],
// 	// 	});
// 	// 	res.status(200).json(response);
// 	// } catch (error) {
// 	// 	res.status(500).json({ msg: error.message });
// 	// }
// };

export const getAllCheckouts = async (req, res) => {
	try {
		const checkouts = await Transaction.findAll({
			include: [
				{
					model: Cart,
					attributes: [
						"uuid",
						"invoice",
						"productUuid",
						"userUuid",
						"desc",
						"quantity",
						"subtotal",
					],
					include: [{ model: Products }],
				},
				{
					model: Users,
					attributes: ["name", "email"],
				},
				{
					model: PaymentMethod,
				},
				{
					model: Address,
				},
				{
					model: ProofOfPayment,
				},
			],
		});

		res.status(200).json(checkouts);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getCheckouts = async (req, res) => {
	try {
		const { invoice, status } = req.query;
		const userUuid = req.params.userUuid;

		let whereClause = {};
		let includeOptions = [
			{
				model: Cart,
				attributes: ["uuid", "invoice", "productUuid", "userUuid", "desc", "quantity", "subtotal"],
				include: [{ model: Products }],
			},
			{
				model: Users,
				attributes: ["name", "email"],
			},
			{
				model: PaymentMethod,
			},
			{
				model: Address,
			},
		];

		if (invoice) {
			whereClause.invoice = invoice;
		} else if (status) {
			if (status === "true") {
				whereClause.userUuid = userUuid;
				whereClause.status = true;
			} else if (status === "false") {
				whereClause.userUuid = userUuid;
				whereClause.status = false;
			} else {
				whereClause.userUuid = userUuid;
				whereClause.status = null;
			}
		} else {
			whereClause.userUuid = userUuid;
		}

		const checkout = await Transaction.findAll({
			where: whereClause,
			include: includeOptions,
		});

		if (checkout.length === 0) {
			return res.status(404).json({ msg: "Checkout tidak ditemukan" });
		}

		res.status(200).json(checkout);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const updateCheckoutStatusByInvoice = async (req, res) => {
	try {
		const invoices = req.params.invoice;
		const { status } = req.body;

		const checkouts = await Transaction.findAll({
			where: {
				invoice: invoices,
			},
			include: { model: Cart },
		});

		if (checkouts.length === 0) {
			return res.status(404).json({ msg: "Checkout tidak ditemukan" });
		}

		await Promise.all(
			checkouts.map(async (checkout) => {
				await checkout.update({ status });

				if (status === true) {
					const cartItem = checkout.cart;

					const product = await Products.findOne({
						where: {
							uuid: cartItem.productUuid,
						},
					});

					if (product) {
						const updatedStock = product.stock - cartItem.quantity;
						await Products.update(
							{
								stock: updatedStock,
							},
							{
								where: {
									uuid: cartItem.productUuid,
								},
							}
						);
					}
				}
			})
		);

		res.status(200).json({ msg: "Status checkout berhasil diperbarui" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

// export const getCheckoutByInvoice = async (req, res) => {
// 	try {
// 		const invoice = req.params.invoice;

// 		const checkout = await Transaction.findAll({
// 			where: {
// 				invoice: invoice,
// 			},
// 			include: [
// 				{
// 					model: Products,
// 					attributes: ["uuid", "nameProduct", "productCategoryUuid", "imageUrl", "stock", "price"],
// 					include: [{ model: ProductCategory, attributes: ["productCategoryName"] }],
// 				},
// 				{
// 					model: Users,
// 					attributes: ["name", "email"],
// 				},
// 			],
// 		});

// 		if (!checkout) {
// 			return res.status(404).json({ msg: "Checkout tidak ditemukan" });
// 		}

// 		res.status(200).json(checkout);
// 	} catch (error) {
// 		res.status(500).json({ msg: error.message });
// 	}
// };

export const addCheckout = async (req, res) => {
	const userUuid = req.session.userUuid;
	const { cartUuid, addressUuid, paymentMethodUuid, ekspedisi, invoice, shippingCost, trackingId } =
		req.body;

	try {
		const userTimezone = moment.tz.guess();
		const currentTime = moment().tz(userTimezone);
		const paymentLimit = currentTime.add(2, "hours");

		await Transaction.create({
			userUuid,
			cartUuid,
			addressUuid,
			invoice,
			paymentMethodUuid,
			trackingId,
			ekspedisi,
			shippingCost,
			paymentLimit: paymentLimit.toISOString(), // Simpan batas waktu pembayaran dalam format ISO
		});

		res.status(201).json({ msg: "Berhasil checkout" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
