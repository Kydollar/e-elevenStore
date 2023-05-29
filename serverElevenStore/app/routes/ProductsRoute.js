import express from "express";
import { createProduct, getProducts, getProductById } from "../controllers/Products.js";

const router = express.Router();

router.get("/product", getProducts);
router.get("/product/:id", getProductById);
router.post("/product", createProduct);

export default router;
