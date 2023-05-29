import express from "express";
import {
	AddAddress,
	deleteAddress,
	editAddress,
	getAddressByUserUuid,
	updateAddressPrimary,
} from "../controllers/Address.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/address-users/:userUuid", verifyUser, getAddressByUserUuid);
router.put("/address-users/:addressId/primary", verifyUser, updateAddressPrimary);
router.put("/address-users/:addressId", verifyUser, editAddress);
router.post("/address-users", verifyUser, AddAddress);
router.delete("/address-users/:addressId", verifyUser, deleteAddress);

export default router;
