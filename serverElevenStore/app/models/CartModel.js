import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Products from "./ProductsModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;
const Cart = db.define(
	"cart",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		invoice: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		productUuid: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		userUuid: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		subtotal: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		statusActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

Users.hasMany(Cart);
Products.hasMany(Cart);
Cart.belongsTo(Users, { foreignKey: "userUuid" });
Cart.belongsTo(Products, { foreignKey: "productUuid" });

export default Cart;
