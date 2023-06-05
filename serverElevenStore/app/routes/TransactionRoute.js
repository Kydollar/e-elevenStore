import express from "express";
import { addCheckout, getAllCheckouts, getCheckouts, updateCheckoutStatusByInvoice } from "../controllers/Transaction.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/checkout", verifyUser, adminOnly, getAllCheckouts);
router.get("/checkout/:userUuid", getCheckouts);
router.post("/checkout", verifyUser, addCheckout);
router.put("/checkout/:invoice", verifyUser, adminOnly, updateCheckoutStatusByInvoice);

export default router;
