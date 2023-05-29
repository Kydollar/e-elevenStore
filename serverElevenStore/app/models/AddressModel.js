import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;
const Address = db.define(
	"address",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /^(\+62|0)[0-9]{9,12}$/,
					msg: "Invalid phone number. Please provide a valid Indonesian phone number.",
				},
			},
		},
		province_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		city_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		postalCode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		detailAddress: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		detailLainnya: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		primaryAddress: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

Users.hasMany(Address);
Address.belongsTo(Users, { foreignKey: "userUuid" });

export default Address;
