import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;
const ProductCategory = db.define(
	"product_categories",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		productCategoryName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 50],
			},
			unique: {
				args: true,
				msg: "Product Category Name sudah digunakan!",
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
        hooks: {
			beforeCreate: function (pc) {
				pc.productCategoryName = pc.productCategoryName.toLowerCase();
				return pc;
			},
		},
	}
);

export default ProductCategory;
