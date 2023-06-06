import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RoleCategory from "./Categories/RoleCategory.js";

const { DataTypes } = Sequelize;
const Users = db.define(
	"users",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 100],
			},
			unique: {
				args: true,
				msg: "username sudah digunakan!",
			},
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		avatarUrl: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 100],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true,
			},
			unique: {
				args: true,
				msg: "Email address sudah digunakan!",
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		roleCategoryUuid: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		otpCode: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		otpCodeExpiration: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		hooks: {
			beforeCreate: function (user) {
				user.username = user.username.toLowerCase();
				user.email = user.email.toLowerCase();
				return user;
			},
		},
	}
);

RoleCategory.hasMany(Users);
Users.belongsTo(RoleCategory, { foreignKey: "roleCategoryUuid" });

export default Users;
