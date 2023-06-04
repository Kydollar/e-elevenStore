import PaymentMethod from "../models/PaymentMethodModel.js";

// Get all payment methods
export const getPaymentMethod = async (req, res) => {
	try {
		const paymentMethods = await PaymentMethod.findAll();
		res.json(paymentMethods);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get payment method by UUID
export const getByUuid = async (req, res) => {
	const { uuid } = req.params;
	try {
		const paymentMethod = await PaymentMethod.findOne({ where: { uuid } });
		if (paymentMethod) {
			res.json(paymentMethod);
		} else {
			res.status(404).json({ message: "Payment method not found" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get payment method by valuePayment
export const getByValuePayment = async (req, res) => {
	const { valuePayment } = req.params;
	try {
		const paymentMethod = await PaymentMethod.findOne({ where: { valuePayment } });
		if (paymentMethod) {
			res.json(paymentMethod);
		} else {
			res.status(404).json({ message: "Payment method not found" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Add a new payment method
export const addPaymentMethod = async (req, res) => {
	const { paymentName, name, norek } = req.body;
	try {
		const paymentMethod = await PaymentMethod.create({
			paymentName,
			valuePayment: paymentName,
			name,
			norek,
		});
		res.status(201).json(paymentMethod);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Update a payment method
export const updatePaymentMethod = async (req, res) => {
	const { uuid } = req.params;
	const { paymentName, name, norek } = req.body;
	try {
		const paymentMethod = await PaymentMethod.findOne({ where: { uuid } });
		if (paymentMethod) {
			paymentMethod.paymentName = paymentName;
			paymentMethod.valuePayment = paymentName;
			paymentMethod.name = name;
			paymentMethod.norek = norek;
			await paymentMethod.save();
			res.json(paymentMethod);
		} else {
			res.status(404).json({ message: "Payment method not found" });
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Delete a payment method
export const deletePaymentMethod = async (req, res) => {
	const { uuid } = req.params;
	try {
		const paymentMethod = await PaymentMethod.findOne({ where: { uuid } });
		if (paymentMethod) {
			await paymentMethod.destroy();
			res.json({ message: "Payment method deleted" });
		} else {
			res.status(404).json({ message: "Payment method not found" });
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
