import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import RoleCategory from "../models/Categories/RoleCategory.js";

export const getCheckUsers = async (req, res) => {
	try {
		const { email, username } = req.query;
		if (email) {
			const user = await User.findOne({ where: { email: email } });
			if (user) {
				res.json({ exists: true });
			} else {
				res.json({ exists: false });
			}
		} else if (username) {
			const user = await User.findOne({ where: { username: username } });
			if (user) {
				res.json({ exists: true });
			} else {
				res.json({ exists: false });
			}
		} else {
			res.status(500).json({ msg: "tidak ada data yang dicari, mohon periksa query anda!" });
		}
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getUsers = async (req, res) => {
	try {
		const response = await User.findAll({
			attributes: [
				"uuid",
				"username",
				"avatar",
				"avatarUrl",
				"name",
				"email",
				"createdAt",
				"updatedAt",
			],
			include: [
				{
					model: RoleCategory,
					attributes: ["uuid", "roleName"],
				},
			],
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
export const getUserById = async (req, res) => {
	try {
		const response = await User.findOne({
			attributes: [
				"uuid",
				"username",
				"avatar",
				"avatarUrl",
				"name",
				"email",
				"createdAt",
				"updatedAt",
				"roleCategoryUuid",
			],
			where: {
				uuid: req.params.id,
			},
			include: [
				{
					model: RoleCategory,
					attributes: ["uuid", "roleName"],
				},
			],
		});
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
export const createUser = async (req, res) => {
	if (req.files === null) {
		const { username, name, email, password, confPassword, roleCategoryUuid } = req.body;
		if (password !== confPassword)
			return res.status(400).json({ msg: "Password dan Confirm Password tidak sama!!!" });
		const hashPassword = await argon2.hash(password);
		const fileName = "defaultAvatar.png";
		const avatarUrl = `${req.protocol}://${req.get("host")}/images/avatar/defaultAvatar.png`;
		try {
			await User.create({
				username: username,
				avatar: fileName,
				avatarUrl: avatarUrl,
				name: name,
				email: email,
				password: hashPassword,
				roleCategoryUuid: roleCategoryUuid,
			});
			res.status(201).json({ msg: "Registrasi telah Berhasil" });
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	} else {
		const file = req.files.file;
		const fileSize = file.data.length;
		const ext = path.extname(file.name);
		const fileName = file.md5 + Date.now() + ext;
		const avatarUrl = `${req.protocol}://${req.get("host")}/images/avatar/${fileName}`;
		const allowedType = [".png", ".jpg", ".jpeg"];
		const { username, name, email, password, confPassword, roleCategoryUuid } = req.body;
		if (!allowedType.includes(ext.toLowerCase()))
			return res.status(422).json({ msg: "Invalid Images" });
		if (fileSize > 5000000) return res.status(422).json({ msg: "Maksimal file gambar yaitu 5 MB" });
		if (password !== confPassword)
			return res.status(400).json({ msg: "Password dan Confirm Password tidak sama!!!" });
		const hashPassword = await argon2.hash(password);
		try {
			await User.create({
				username: username,
				avatar: fileName,
				avatarUrl: avatarUrl,
				name: name,
				email: email,
				password: hashPassword,
				roleCategoryUuid: roleCategoryUuid,
			});
			file.mv(`./public/images/avatar/${fileName}`, (err) => {
				if (err) return res.status(500).json({ msg: err.message });
			});
			res.status(201).json({ msg: "Registrasi telah Berhasil" });
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};
export const updateUser = async (req, res) => {
	// NEW
	const user = await User.findOne({
		where: {
			uuid: req.params.id,
		},
	});
	let fileName = "";
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
	const { username, name, email, roleCategoryUuid } = req.body;
	// new
	if (req.files === null) {
		fileName = user.avatar;
	} else {
		const file = req.files.file;
		const fileSize = file.data.length;
		const ext = path.extname(file.name);
		fileName = file.md5 + Date.now() + ext;
		const allowedType = [".png", ".jpg", ".jpeg"];

		if (!allowedType.includes(ext.toLowerCase()))
			return res.status(422).json({ msg: "Invalid Images" });
		if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

		if (user.avatar !== "" && user.avatar !== "defaultAvatar.png") {
			const filepath = `./public/images/avatar/${user.avatar}`;
			fs.unlinkSync(filepath);
		}

		file.mv(`./public/images/avatar/${fileName}`, (err) => {
			if (err) return res.status(500).json({ msg: err.message });
		});
	}
	const avatarUrl = `${req.protocol}://${req.get("host")}/images/avatar/${fileName}`;

	try {
		await User.update(
			{
				username: username,
				avatar: fileName,
				avatarUrl: avatarUrl,
				name: name,
				email: email,
				roleCategoryUuid: roleCategoryUuid,
			},
			{
				where: {
					uuid: user.uuid,
				},
			}
		);
		res.status(200).json({ msg: "User Updated" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updatePasswordUser = async (req, res) => {
	const user = await User.findOne({
		where: {
			uuid: req.params.id,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
	const { email, password, confPassword } = req.body;
	let hashPassword;
	if (password === "" || password === null) {
		hashPassword = user.password;
	} else {
		hashPassword = await argon2.hash(password);
	}
	if (password !== confPassword)
		return res.status(400).json({ msg: "Confirm Password dengan Password tidak cocok" });
	try {
		await User.update(
			{
				email: email,
				password: hashPassword,
			},
			{
				where: {
					uuid: user.uuid,
				},
			}
		);
		res.status(200).json({ msg: "Password telah berhasil diperbarui" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteUser = async (req, res) => {
	const user = await User.findOne({
		where: {
			uuid: req.params.id,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan!" });
	try {
		await User.destroy({
			where: {
				uuid: user.uuid,
			},
		});
		const filepath = `./public/images/avatar/${user.avatar}`;
		fs.unlinkSync(filepath);
		res.status(200).json({ msg: "User telah Berhasil didelete!" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateProfile = async (req, res) => {
	const user = await User.findOne({
		where: {
			uuid: req.params.uuid,
		},
	});

	let fileName = "";
	if (!user) return res.status(404).json({ msg: "User not found" });
	const { username, name, email } = req.body;

	if (req.files === null) {
		fileName = user.avatar;
	} else {
		const file = req.files.file;
		const fileSize = file.data.length;
		const ext = path.extname(file.name);
		fileName = file.md5 + Date.now() + ext;
		const allowedType = [".png", ".jpg", ".jpeg"];

		if (!allowedType.includes(ext.toLowerCase()))
			return res.status(422).json({ msg: "Invalid image format" });
		if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

		if (user.avatar !== "" && user.avatar !== "defaultAvatar.png") {
			const filepath = `./public/images/avatar/${user.avatar}`;
			if (fs.existsSync(filepath)) {
				fs.unlinkSync(filepath);
			}
		}

		file.mv(`./public/images/avatar/${fileName}`, (err) => {
			if (err) return res.status(500).json({ msg: err.message });
		});
	}

	const avatarUrl = `${req.protocol}://${req.get("host")}/images/avatar/${fileName}`;

	try {
		await User.update(
			{
				username: username,
				avatar: fileName,
				avatarUrl: avatarUrl,
				name: name,
				email: email,
			},
			{
				where: {
					uuid: user.uuid,
				},
			}
		);

		res.status(200).json({ msg: "User updated" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
