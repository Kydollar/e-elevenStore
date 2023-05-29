import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import { Op } from "sequelize";
import RoleCategory from "../models/Categories/RoleCategory.js";

export const Login = async (req, res) => {
	const user = await User.findOne({
		where: {
			[Op.or]: [
				{
					email: req.body.email,
				},
				{
					username: req.body.email,
				},
			],
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan!" });
	const match = await argon2.verify(user.password, req.body.password);
	if (!match) return res.status(400).json({ msg: "Password salah!" });
	req.session.userUuid = user.uuid;
	const uuid = user.uuid;
	const name = user.name;
	const username = user.username;
	const email = user.email;
	const role = user.role;
	res.status(200).json({ uuid, name, username, email, role });
};

export const Register = async (req, res) => {
	const roleCategoryUuid = "43cd5f0b-19a4-42c7-97ca-d145f27257a9";
	const { username, name, email, password, confPassword } = req.body;

	if (req.files === null) {
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

export const Me = async (req, res) => {
	if (!req.session.userUuid) {
		return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
	}
	const user = await User.findOne({
		attributes: ["uuid", "name", "username", "email", "avatarUrl"],
		where: {
			uuid: req.session.userUuid,
		},
		include: [
			{
				model: RoleCategory,
				attributes: ["uuid", "roleName"],
			},
		],
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
	res.status(200).json(user);
};

export const logOut = (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(400).json({ msg: "Anda tidak dapat Logout" });
		res.status(200).json({ msg: "Anda telah Berhasil Logout" });
	});
};
