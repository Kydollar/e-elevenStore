import RoleCategory from "../../models/Categories/RoleCategory.js";
import Users from "../../models/UserModel.js";

export const getRoleCategories = async (req, res) => {
	try {
		const response = await RoleCategory.findAll({
			attributes: ["uuid", "roleName"],
			include: { model: Users },
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
export const getRoleCategoryById = async (req, res) => {
	try {
		const response = await RoleCategory.findOne({
			attributes: ["uuid", "roleName"],
			where: {
				uuid: req.params.id,
			},
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const createRoleCategory = async (req, res) => {
	const { roleName } = req.body;
	try {
		await RoleCategory.create({
			roleName: roleName,
		});
		res.status(201).json({ msg: "Role Category Berhasil ditambahkan" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
