import ContacInfo from '../models/contactInfo.model.js';
import { timeZoneLima } from '../timezone.js';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import Costumer from '../models/costumer.model.js';

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

	async findAll(where) {
		const contactInfos = await ContacInfo.findAll({
			where,
			include: [
				{
					model: Costumer,
				},
			],
		});
		return contactInfos;
	}

	async findOne(where) {
		const contactInfo = await ContacInfo.findOne({
			where,
			include: [
				{
					model: Costumer,
				},
			],
		});
		return contactInfo;
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

	async delete(id) {
		const time = timeZoneLima();
		const update_area = await ContacInfo.update(
			{
				updated_at: time,
				deleted_at: time,
			},
			{ where: { id } }
		);
		return update_area[0];
	}

	convertCSVinObject(buffer_file) {
		return new Promise((resolve, reject) => {
			const result = [];
			createReadStream(buffer_file, 'utf8')
				.pipe(csv())
				.on('data', (chuck) => {
					result.push(chuck);
				})
				.on('end', () => {
					return resolve(result);
				})
				.on('error', () => {
					return reject(null);
				});
		});
	}

	async updateOrCreateContact(data) {
		const { name, lastname, phone, email, rol, costumer_id } = data;
		const exist = await ContacInfo.findOne({
			where: { email, costumer_id, deleted_at: null },
		});
		if (exist) {
			const updt = await exist.update({
				name,
				lastname,
				phone,
				rol,
				updated_at: timeZoneLima(),
			});
			return updt;
		}
		const new_contact = await this.create(data);
		return new_contact;
	}
}
