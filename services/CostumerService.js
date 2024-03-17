import ContacInfo from '../models/contactInfo.model.js';
import Costumer from '../models/costumer.model.js';
import TiInfo from '../models/tiInfo.model.js';
import { timeZoneLima } from '../timezone.js';

export default class CostumerService {
	async findOneById(id) {
		const costumer = await Costumer.findOne({
			where: { id, deleted_at: null },
			attributes: [
				'id',
				'name',
				'domain',
				'phone',
				'email',
				'address',
				'province',
				'company_anniversary',
				'sales_manager',
				'ruc',
				'created_at',
			],
			include: [
				{
					model: ContacInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'rol',
						'created_at',
					],
				},
				{
					model: TiInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'created_at',
					],
				},
			],
		});
		return costumer;
	}

	async findOneByDomain(domain) {
		const costumer = await Costumer.findOne({
			where: { domain, deleted_at: null },
			attributes: [
				'id',
				'name',
				'domain',
				'phone',
				'email',
				'address',
				'province',
				'company_anniversary',
				'sales_manager',
				'ruc',
				'created_at',
			],
			include: [
				{
					model: ContacInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'rol',
						'created_at',
					],
				},
				{
					model: TiInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'created_at',
					],
				},
			],
		});
		return costumer;
	}

	async findAll() {
		const costumers = await Costumer.findAll({
			where: { deleted_at: null },
			attributes: [
				'id',
				'name',
				'domain',
				'phone',
				'email',
				'address',
				'province',
				'company_anniversary',
				'ruc',
				'sales_manager',
				'created_at',
			],
			include: [
				{
					model: ContacInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'rol',
						'created_at',
					],
				},
				{
					model: TiInfo,
					attributes: [
						'id',
						'name',
						'lastname',
						'phone',
						'email',
						'created_at',
					],
				},
			],
		});
		return costumers;
	}

	async create(costumer) {
		const {
			name,
			domain,
			phone,
			email,
			address,
			province,
			company_anniversary,
			sales_manager,
			ruc,
		} = costumer;
		const new_costumer = Costumer.build({
			name,
			domain,
			phone,
			email,
			address,
			province,
			company_anniversary,
			sales_manager,
			ruc,
			created_at: timeZoneLima(),
		});
		try {
			const n_costumer = await new_costumer.save();
			return n_costumer;
		} catch (error) {
			return null;
		}
	}

	async update(costumer) {
		const {
			id,
			name,
			domain,
			phone,
			email,
			address,
			province,
			company_anniversary,
			sales_manager,
			ruc,
		} = costumer;
		try {
			const edit_costumer = await Costumer.update(
				{
					name,
					domain,
					phone,
					email,
					address,
					province,
					company_anniversary,
					sales_manager,
					ruc,
					updated_at: timeZoneLima(),
				},
				{ where: { id, deleted_at: null } }
			);
			return edit_costumer;
		} catch (error) {
			return null;
		}
	}

	async delete(id) {
		const time = timeZoneLima();
		try {
			const user_deleted = await Costumer.update(
				{
					deleted_at: time,
					updated_at: time,
				},
				{ where: { id } }
			);
			return user_deleted;
		} catch (error) {
			return null;
		}
	}
}
