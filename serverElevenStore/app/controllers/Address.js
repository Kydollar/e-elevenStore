import Address from "../models/AddressModel.js";

export const getAddressByUserUuid = async (req, res) => {
	const { addressUuid, primary } = req.query;

	let response;
	try {
		if (addressUuid) {
			const address = await Address.findOne({
				where: {
					uuid: addressUuid,
				},
			});
			if (!address) return res.status(404).json({ msg: "Address tidak ditemukan" });
			response = await Address.findOne({
				attributes: [
					"uuid",
					"userUuid",
					"name",
					"province_id",
					"city_id",
					"postalCode",
					"detailAddress",
					"detailLainnya",
					"primaryAddress",
					"phoneNumber",
				],
				where: {
					uuid: address.uuid,
				},
			});
		} else {
			if (primary === "true") {
				const address = await Address.findOne({
					where: {
						userUuid: req.params.userUuid,
					},
				});
				if (!address) return res.status(404).json({ msg: "Address tidak ditemukan" });
				response = await Address.findAll({
					attributes: [
						"uuid",
						"userUuid",
						"name",
						"province_id",
						"city_id",
						"postalCode",
						"detailAddress",
						"detailLainnya",
						"primaryAddress",
						"phoneNumber",
					],
					where: {
						userUuid: address.userUuid,
						primaryAddress: true,
					},
				});
			} else {
				const address = await Address.findOne({
					where: {
						userUuid: req.params.userUuid,
					},
				});
				if (!address) return res.status(404).json({ msg: "Address tidak ditemukan" });
				response = await Address.findAll({
					attributes: [
						"uuid",
						"userUuid",
						"name",
						"province_id",
						"city_id",
						"postalCode",
						"detailAddress",
						"detailLainnya",
						"primaryAddress",
						"phoneNumber",
					],
					where: {
						userUuid: address.userUuid,
					},
				});
			}
		}

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const AddAddress = async (req, res) => {
	const { name, phoneNumber, province_id, city_id, postalCode, detailAddress, detailLainnya } =
		req.body;

	const userUuid = req.session.userUuid;

	try {
		const existingAddress = await Address.findOne({
			where: {
				userUuid,
			},
		});

		let primaryAddress = false;
		if (!existingAddress) {
			primaryAddress = true;
		}

		await Address.create({
			userUuid,
			name,
			phoneNumber: "+62" + phoneNumber,
			province_id,
			city_id,
			postalCode,
			detailAddress,
			detailLainnya,
			primaryAddress,
		});

		res.status(201).json({ msg: "Address Berhasil ditambahkan Kekeranjang" });
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateAddressPrimary = async (req, res) => {
	const { addressId } = req.params;
	const userUuid = req.session.userUuid;

	try {
		// Mengubah semua address dengan primaryAddress menjadi false
		await Address.update(
			{ primaryAddress: false },
			{
				where: {
					userUuid,
				},
			}
		);

		// Mengubah address dengan addressId yang diberikan menjadi primaryAddress true
		await Address.update(
			{ primaryAddress: true },
			{
				where: {
					uuid: addressId,
				},
			}
		);

		res.status(200).json({ msg: "Address berhasil diubah menjadi primary" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const deleteAddress = async (req, res) => {
	const { addressId } = req.params;
	const userUuid = req.session.userUuid;

	try {
		// Find the address to be deleted
		const address = await Address.findOne({
			where: {
				uuid: addressId,
				userUuid: userUuid,
			},
		});

		// If the address doesn't exist or doesn't belong to the user, return an error
		if (!address) {
			return res.status(404).json({ msg: "Address not found" });
		}

		// Delete the address
		await address.destroy();

		res.status(200).json({ msg: "Address successfully deleted" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const editAddress = async (req, res) => {
	const { addressId } = req.params;
	const userUuid = req.session.userUuid;
	const { name, phoneNumber, province_id, city_id, postalCode, detailAddress, detailLainnya } =
		req.body;

	try {
		// Find the address to be edited
		const address = await Address.findOne({
			where: {
				uuid: addressId,
				userUuid: userUuid,
			},
		});

		// If the address doesn't exist or doesn't belong to the user, return an error
		if (!address) {
			return res.status(404).json({ msg: "Address not found" });
		}

		// Update the address
		await address.update({
			name,
			phoneNumber: "+62" + phoneNumber,
			province_id,
			city_id,
			postalCode,
			detailAddress,
			detailLainnya,
		});

		res.status(200).json({ msg: "Address successfully updated" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};
