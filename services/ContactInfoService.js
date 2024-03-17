import ContacInfo from '../models/contactInfo.model.js';
import { timeZoneLima } from '../timezone.js';

export default class ContactInfoService {
	async create(contact_info) {
		const { name, lastname, phone, email, rol, costumer_id } = contact_info;
		const new_contactInfo = ContacInfo.build({
			name,
			lastname,
			phone,
			email,
			rol,
			costumer_id,
			created_at: timeZoneLima(),
		});

		try {
			const n_contactInfo = await new_contactInfo.save();
			return n_contactInfo;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async findOneByEmail(email) {
		const contactInfo = await ContacInfo.findOne({
			where: { email, deleted_at: null },
		});
		return contactInfo;
	}

	async findAllByCostumerId(costumer_id) {
		const contacsInfo = await ContacInfo.findAll({
			where: {
				costumer_id,
				deleted_at: null,
			},
		});
		return contacsInfo;
	}

	async update(contact_info) {
		const { id, name, lastname, phone, email, rol } = contact_info;
		try {
			const edit_contactInfo = await ContacInfo.update(
				{
					name,
					lastname,
					phone,
					email,
					rol,
					updated_at: timeZoneLima(),
				},
				{ where: { id, deleted_at: null } }
			);
			return edit_contactInfo;
		} catch (error) {
			return null;
		}
	}
}
