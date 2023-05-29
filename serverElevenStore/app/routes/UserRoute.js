import express from "express";
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	updatePasswordUser,
	deleteUser,
	getCheckUsers,
	updateProfile,
} from "../controllers/Users.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users/check", getCheckUsers);
router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, adminOnly, getUserById);
router.post("/users", verifyUser, adminOnly, createUser);
router.patch("/users/:id", verifyUser, adminOnly, updateUser);
router.patch("/users/profile/:uuid", verifyUser, updateProfile);
router.patch("/users/:id/password", verifyUser, adminOnly, updatePasswordUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

export default router;
