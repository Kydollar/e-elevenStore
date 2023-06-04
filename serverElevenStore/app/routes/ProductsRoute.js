import express from "express";
import {
	createProduct,
	getProducts,
	getProductById,
	getSearch,
	updateProduct,
    deleteProduct,
} from "../controllers/Products.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/product/search", getSearch);
router.get("/product", getProducts);
router.get("/product/:uuid", getProductById);
router.put("/product/:uuid", verifyUser, adminOnly, updateProduct);
router.post("/product", verifyUser, adminOnly, createProduct);
router.delete("/product/:uuid", verifyUser, adminOnly, deleteProduct);

export default router;
