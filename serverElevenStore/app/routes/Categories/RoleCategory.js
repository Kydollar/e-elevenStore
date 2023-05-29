import express from "express";
import {
	getRoleCategories,
	getRoleCategoryById,
	createRoleCategory,
} from "../../controllers/Categories/RoleCategory.js";

const router = express.Router();

router.get("/role", getRoleCategories);
router.get("/role/:id", getRoleCategoryById);
router.post("/role", createRoleCategory);

export default router;
