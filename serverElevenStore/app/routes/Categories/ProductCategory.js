import express from "express";
import {
	createProductCategory,
	deleteProductCategory,
	getProductCategories,
	getProductCategoryById,
	getProductCategoryByName,
	updateProductCategory,
} from "../../controllers/Categories/ProductCategory.js";
import { adminOnly, verifyUser } from "../../middleware/AuthUser.js";

const router = express.Router();

router.get("/product-categories", getProductCategories);
router.get("/product-categories/:id", getProductCategoryById);
router.get("/product-catalog/:name", getProductCategoryByName);
router.post("/product-categories", verifyUser, adminOnly, createProductCategory);
router.put("/product-categories/:uuid", verifyUser, adminOnly, updateProductCategory);
router.delete("/product-categories/:uuid", verifyUser, adminOnly, deleteProductCategory);

export default router;
