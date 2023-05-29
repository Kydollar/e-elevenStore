import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;
const PaymentMethod = db.define(
	"payment_method",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		paymentName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		valuePayment: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [3, 50],
			},
			unique: {
				args: true,
				msg: "Payment Name sudah digunakan!",
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		norek: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
		hooks: {
			beforeCreate: function (pm) {
				pm.valuePayment = pm.valuePayment.toLowerCase().replace(/\s+/g, "-");
				return pm;
			},
		},
	}
);

export default PaymentMethod;
