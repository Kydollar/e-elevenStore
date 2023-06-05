import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;
const ProofOfPayment = db.define(
	"proof_of_payment",
	{
		invoice: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
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
