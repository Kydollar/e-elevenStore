import express from "express";
import { addCheckout, getCheckouts } from "../controllers/Transaction.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/checkout/:userUuid", getCheckouts);
router.post("/checkout", verifyUser, addCheckout);

export default router;
