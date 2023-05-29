import express from "express";
import { Login, logOut, Me, Register } from "../controllers/Auth.js";

const router = express.Router();

router.get("/me", Me);
router.post("/login", Login);
router.post("/register", Register);
router.delete("/logout", logOut);

export default router;
