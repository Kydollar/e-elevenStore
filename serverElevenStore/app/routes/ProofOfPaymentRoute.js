import express from "express";
import {
	getByUuidProofOfPayment,
	addProofOfPayment,
	updateProofOfPayment,
	deleteProofOfPayment,
    getByInvoiceProofOfPayment,
} from "../controllers/ProofOfPayment.js";

const router = express.Router();

// Get ProofOfPayment by UUID
router.get("/proof-of-payment/:uuid", getByUuidProofOfPayment);

// Get ProofOfPayment by UUID
router.get("/proof-of-payment/invoice/:invoice", getByInvoiceProofOfPayment);

// Add a new ProofOfPayment
router.post("/proof-of-payment", addProofOfPayment);

// Update an existing ProofOfPayment
router.put("/proof-of-payment/:uuid", updateProofOfPayment);

// Delete a ProofOfPayment
router.delete("/proof-of-payment/:invoice", deleteProofOfPayment);

export default router;
