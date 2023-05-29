import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import ProductCategory from "./Categories/ProductCategory.js";

const { DataTypes } = Sequelize;
const Products = db.define(
	"products",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
			unique: {
				args: true,
				msg: "slug sudah digunakan!",
			},
		},
		nameProduct: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 100],
			},
		},
		productCategoryUuid: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		imageUrl: {
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
        stock: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        price: {
            type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
        }
	},
	{
		freezeTableName: true,
		hooks: {
			beforeCreate: function (Products) {
				Products.slug = Products.slug.toLowerCase().replace(/ /g, "-");
				return Products;
			},
		},
		timestamps: true,
	}
);

ProductCategory.hasMany(Products);
Products.belongsTo(ProductCategory, { foreignKey: "productCategoryUuid" });

export default Products;
