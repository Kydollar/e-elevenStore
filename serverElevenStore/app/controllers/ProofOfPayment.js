import ProofOfPayment from "../models/ProofOfPaymentModel.js";
import path from "path";
import fs from "fs"

// Get ProofOfPayment by UUID
export const getByUuidProofOfPayment = async (req, res) => {
	try {
		const { uuid } = req.params;
		const proofOfPayment = await ProofOfPayment.findOne({ where: { uuid } });

		if (!proofOfPayment) {
			return res.status(404).json({ message: "ProofOfPayment not found" });
		}

		return res.json(proofOfPayment);
	} catch (error) {
		console.error("Error in getByUuid:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getByInvoiceProofOfPayment = async (req, res) => {
	try {
		const { invoice } = req.params;
		const proofOfPayment = await ProofOfPayment.findOne({ where: { invoice } });

		if (!proofOfPayment) {
			return res.status(404).json({ message: "ProofOfPayment not found" });
		}

		return res.json(proofOfPayment);
	} catch (error) {
		console.error("Error in getByUuidProofOfPayment:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Add a new ProofOfPayment
export const addProofOfPayment = async (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ msg: "No files were uploaded." });
	} else {
		const file = req.files.file;
		const fileSize = file.data.length;
		const ext = path.extname(file.name);
		const fileName = file.md5 + Date.now() + ext;
		const fileUrl = `${req.protocol}://${req.get("host")}/filePayment/${fileName}`;
		const allowedType = [".png", ".jpg", ".jpeg", ".pdf"];
		const { invoice } = req.body;
		if (!allowedType.includes(ext.toLowerCase()))
			return res.status(422).json({ msg: "Invalid File" });
		if (fileSize > 5000000) return res.status(422).json({ msg: "Maksimal file yaitu 5 MB" });
		try {
			await ProofOfPayment.create({
				invoice,
				file: fileName,
				fileUrl,
			});
			file.mv(`./public/filePayment/${fileName}`, (err) => {
				if (err) return res.status(500).json({ msg: err.message });
			});
			res.status(201).json({ msg: "Pembayaran telah Berhasil" });
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};

// Update an existing ProofOfPayment
export const updateProofOfPayment = async (req, res) => {
	try {
		const { uuid } = req.params;
		const { invoice, file } = req.body;
		const proofOfPayment = await ProofOfPayment.findOne({ where: { uuid } });

		if (!proofOfPayment) {
			return res.status(404).json({ message: "ProofOfPayment not found" });
		}

		proofOfPayment.invoice = invoice;
		proofOfPayment.file = file;
		await proofOfPayment.save();

		return res.json(proofOfPayment);
	} catch (error) {
		console.error("Error in update:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a ProofOfPayment
export const deleteProofOfPayment = async (req, res) => {
	try {
		const { invoice } = req.params;
		const proofOfPayment = await ProofOfPayment.findOne({ where: { invoice } });

		if (!proofOfPayment) {
			return res.status(404).json({ message: "ProofOfPayment not found" });
		}

		await proofOfPayment.destroy();
		const filepath = `./public/filePayment/${proofOfPayment.file}`;
		fs.unlinkSync(filepath);
		return res.json({ message: "ProofOfPayment deleted successfully" });
	} catch (error) {
		console.error("Error in delete:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
