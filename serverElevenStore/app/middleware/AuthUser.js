import User from "../models/UserModel.js";
import RoleCategory from "../models/Categories/RoleCategory.js";

export const verifyUser = async (req, res, next) => {
	if (!req.session.userUuid) {
		return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
	}
	const user = await User.findOne({
		where: {
			uuid: req.session.userUuid,
		},
        include: [
            {
                model: RoleCategory,
                attributes: ["roleName"],
            },
        ],
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
	req.userUuid = user.uuid;
	req.role_category = user.role_category;
	next();
};

export const adminOnly = async (req, res, next) => {
	const user = await User.findOne({
		where: {
			uuid: req.session.userUuid,
		},
        include: [
            {
                model: RoleCategory,
                attributes: ["roleName"],
            },
        ],
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
	if (user.role_category.roleName !== "admin")
		return res
			.status(403)
			.json({ msg: "Akses terlarang, hanya Admin yang dapat melakukannya!" });
	next();
};
