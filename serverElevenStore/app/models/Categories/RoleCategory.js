import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;
const RoleCategory = db.define(
	"role_categories",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		roleName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 50],
			},
			unique: {
				args: true,
				msg: "Role Name sudah digunakan!",
			},
		},
	},
	{
		freezeTableName: true,
		hooks: {
			beforeCreate: function(role_categories){
				role_categories.roleName = role_categories.roleName.toLowerCase();
				return role_categories;
			}
		}
	}
);
export default RoleCategory;
