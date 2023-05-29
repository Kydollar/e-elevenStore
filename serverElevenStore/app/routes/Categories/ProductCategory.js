import express from "express";
import { createProductCategory, getProductCategories, getProductCategoryById, getProductCategoryByName } from "../../controllers/Categories/ProductCategory.js";

const router = express.Router();

router.get("/product-categories", getProductCategories);
router.get("/product-categories/:id", getProductCategoryById);
router.get("/product-catalog/:name", getProductCategoryByName);
router.post("/product-categories", createProductCategory);

export default router;