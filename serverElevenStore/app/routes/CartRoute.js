import express from "express";
import { addCart, getCartByUserUuid, deleteByCartUuidUser, updateCart } from "../controllers/Cart.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/cart/:userUuid", verifyUser, getCartByUserUuid);
router.post("/cart", verifyUser, addCart);
router.delete("/cart/delete/:uuid", verifyUser, deleteByCartUuidUser);
router.put("/cart/:uuid", verifyUser, updateCart);

export default router;
