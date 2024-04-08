import Oportunity from '../models/oportunity.model.js';
import { timeZoneLima } from '../timezone.js';
import User from '../models/user.model.js';
import Costumer from '../models/costumer.model.js';
import SalesClosed from '../models/salesClosed.model.js';

export default class OportunityService {
	async create(oportunity) {
		const {
			name,
			description,
			user_id,
			costumer_id,
			start_date,
			state,
			ammount,
			notes,
			currency,
			cost_center,
		} = oportunity;

		const new_oportunity = Oportunity.build({
			name,
			description,
			user_id,
			costumer_id,
			start_date,
			state,
			ammount,
			notes,
			currency,
			cost_center,
			created_at: timeZoneLima(),
		});

		const n_oportunity = await new_oportunity.save();
		return n_oportunity;
	}

	async findOne(where, attributes) {
		const oportunity = await Oportunity.findOne({
			where,
			attributes,
			include: [
				{
					model: User,
				},
				{
					model: Costumer,
				},
				{
					model: SalesClosed,
				},
			],
		});

		return oportunity;
	}

	async findAll(where, attributes) {
		const oportunities = await Oportunity.findAll({
			where,
			attributes,
			include: [
				{
					model: User,
				},
				{
					model: Costumer,
				},
				{
					model: SalesClosed,
				},
			],
		});

		return oportunities;
	}

	async update(oportunity, where) {
		const {
			name,
			description,
			user_id,
			costumer_id,
			sales_closed_id,
			start_date,
			end_date,
			state,
			ammount,
			notes,
			currency,
			cost_center,
		} = oportunity;

		const updt_oportunity = await Oportunity.update(
			{
				name,
				description,
				user_id,
				costumer_id,
				sales_closed_id,
				start_date,
				end_date,
				state,
				ammount,
				notes,
				currency,
				cost_center,
				updated_at: timeZoneLima(),
			},
			{ where }
		);
		return updt_oportunity;
	}

	async delete(id) {
		const del_oportunity = await Oportunity.update(
			{ deleted_at: timeZoneLima(), updated_at: timeZoneLima() },
			{ where: { id } }
		);
		return del_oportunity;
	}

	async updateToSaleClosed(oportunity) {
		const exist = await Oportunity.findOne(
			{ where: { id: oportunity.id, deleted_at: null } },
			['sales_closed_id']
		);
		if (!exist) return { ok: false, message: 'La oportunidad no existe' };

		if (exist['sales_closed_id'])
			return { ok: false, message: 'La oportunidad tiene un cierre asociado' };

		await exist.update({
			sales_closed_id: oportunity['sales_closed_id'],
			updated_at: timeZoneLima(),
		});

		return { ok: true, message: 'Oportunidad cerrada correctamente' };
	}
}
