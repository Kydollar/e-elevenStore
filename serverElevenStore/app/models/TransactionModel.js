import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Cart from "./CartModel.js";
import Users from "./UserModel.js";
import Address from "./AddressModel.js";
import PaymentMethod from "./PaymentMethodModel.js";
import ProofOfPayment from "./ProofOfPaymentModel.js";

const { DataTypes } = Sequelize;
const Transaction = db.define(
	"transaction",
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
		cartUuid: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		addressUuid: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		invoice: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		paymentMethodUuid: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		trackingId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ekspedisi: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		shippingCost: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		paymentLimit: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: null,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

Users.hasMany(Transaction);
Cart.hasMany(Transaction);
Address.hasMany(Transaction);
PaymentMethod.hasMany(Transaction);
Transaction.belongsTo(Users, { foreignKey: "userUuid" });
Transaction.belongsTo(Cart, { foreignKey: "cartUuid" });
Transaction.belongsTo(Address, { foreignKey: "addressUuid" });
Transaction.belongsTo(PaymentMethod, { foreignKey: "paymentMethodUuid" });
Transaction.hasOne(ProofOfPayment, { foreignKey: "invoice", sourceKey: "invoice" });

export default Transaction;
