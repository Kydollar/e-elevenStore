import express from "express";
import {
	getPaymentMethod,
	getByUuid,
	addPaymentMethod,
	updatePaymentMethod,
	deletePaymentMethod,
	getByValuePayment,
} from "../controllers/PaymentMethod.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Get all payment methods
router.get("/payment-methods", verifyUser, getPaymentMethod);

// Get payment method by UUID
router.get("/payment-methods/:uuid", verifyUser, getByUuid);

// Get payment method by UUID
router.get("/payment-methods/value-payment/:valuePayment", verifyUser, getByValuePayment);

// Add a new payment method
router.post("/payment-methods", verifyUser, addPaymentMethod);

// Update a payment method
router.put("/payment-methods/:uuid", verifyUser, updatePaymentMethod);

// Delete a payment method
router.delete("/payment-methods/:uuid", verifyUser, deletePaymentMethod);

export default router;
