import express from "express";
import { createProduct, getProducts, getProductById, getSearch } from "../controllers/Products.js";

const router = express.Router();

router.get("/product/search", getSearch);
router.get("/product", getProducts);
router.get("/product/:id", getProductById);
router.post("/product", createProduct);

export default router;
