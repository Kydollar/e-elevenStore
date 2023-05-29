import RoleCategory from "../models/Categories/RoleCategory.js";
import Users from "../models/UserModel.js";

// export const transactionMiddleware = async (req, res, next) => {
// 	const { invoice } = req.query;

// 	if (!req.session.userUuid) {
// 		return res.status(401).json({ msg: "Unauthorized" });
// 	}

// 	try {
// 		const user = await Users.findOne({
// 			where: {
// 				uuid: req.session.userUuid,
// 			},
// 			include: [
// 				{
// 					model: RoleCategory,
// 					attributes: ["roleName"],
// 				},
// 			],
// 		});

// 		if (!user) {
// 			return res.status(404).json({ msg: "User tidak ditemukan" });
// 		}

// 		if (invoice && user.role_category.roleName !== "user") {
// 			return res.status(403).json({ msg: "Akses terlarang, hanya User yang dapat melakukannya!" });
// 		}

// 		if (!invoice && user.role_category.roleName !== "admin") {
// 			return res.status(403).json({ msg: "Akses terlarang, hanya Admin yang dapat melakukannya!" });
// 		}

// 		next();
// 	} catch (error) {
// 		res.status(500).json({ msg: "Internal Server Error" });
// 	}
// };
