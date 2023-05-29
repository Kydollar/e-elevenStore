import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;
const ProofOfPayment = db.define(
	"proof_of_payment",
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
			allowNull: true,
		},
		file: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		fileUrl: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

export default ProofOfPayment;
