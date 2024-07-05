//import ContacInfo from '../models/contactInfo.model.js';
import Costumer from '../models/costumer.model.js';
//import TiInfo from '../models/tiInfo.model.js';
import { timeZoneLima } from '../timezone.js';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import UserCostumer from '../models/userCostumer.model.js';
import User from '../models/user.model.js';
import Sale from '../models/sale.model.js';

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
			// include: [
			// 	{
			// 		model: ContacInfo,
			// 		attributes: [
			// 			'id',
			// 			'name',
			// 			'lastname',
			// 			'phone',
			// 			'email',
			// 			'rol',
			// 			'created_at',
			// 		],
			// 	},
			// 	{
			// 		model: TiInfo,
			// 		attributes: [
			// 			'id',
			// 			'name',
			// 			'lastname',
			// 			'phone',
			// 			'email',
			// 			'created_at',
			// 		],
			// 	},
			// ],
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
			// include: [
			// 	{
			// 		model: ContacInfo,
			// 		attributes: [
			// 			'id',
			// 			'name',
			// 			'lastname',
			// 			'phone',
			// 			'email',
			// 			'rol',
			// 			'created_at',
			// 		],
			// 	},
			// 	{
			// 		model: TiInfo,
			// 		attributes: [
			// 			'id',
			// 			'name',
			// 			'lastname',
			// 			'phone',
			// 			'email',
			// 			'created_at',
			// 		],
			// 	},
			// ],
		});
		return costumer;
	}

	async findOne(where, attributes) {
		const costumer = await Costumer.findOne(
			{ 
				where,
				attributes,
				include: [
					{
						model: UserCostumer,
						attributes: ['user_id'],
						where:{deleted_at:null},
						required:false,
						include: [
							{
								model: User,
								attributes: ['name', 'lastname', 'email'],
							},
						],
					},
					{
						model:User,
					},
					{
						model:Sale,
						where:{deleted_at:null},
						required:false,
					}
				], 
			});
		return costumer;
	}

	async findAll(where, attributes) {
		const costumers = await Costumer.findAll({
			where,
			attributes,
			order:[['created_at','DESC']],
			include: [
				{
					model: UserCostumer,
					attributes: ['user_id'],
					where:{deleted_at:null},
					required:false,
					include: [
						{
							model: User,
							attributes: ['name', 'lastname', 'email'],
						},
					],
				},
				{
					model:User,
				},
				{
					model:Sale,
					where:{deleted_at:null},
					required:false,
				}
			],	
		});
		return costumers;
	}

	async findAllSimpleInfo(where, attributes) {
		const costumers = await Costumer.findAll({
			where,
			attributes,
			include: [
				{
					model: UserCostumer,
					attributes: ['user_id'],
					where:{deleted_at:null},
					required:false,
				}
			]
		});
		return costumers;
	}

	async create(costumer) {
		const {
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			state,
			company_anniversary,
			manager_id,
			type,
			drive_folder_id,
			sector
		} = costumer;
		const new_costumer = Costumer.build({
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			state,
			company_anniversary,
			manager_id,
			type,
			drive_folder_id,
			sector,
			created_at: timeZoneLima(),
		});
		const n_costumer = await new_costumer.save();
		return n_costumer;
	}

	async update(costumer) {
		const {
			id,
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			state,
			company_anniversary,
			manager_id,
			type,
			drive_folder_id,
			sector
		} = costumer;
		const edit_costumer = await Costumer.update(
			{
				name,
				ruc_type,
				ruc,
				domain,
				email,
				phone,
				address,
				province,
				country,
				state,
				company_anniversary,
				manager_id,
				type,
				drive_folder_id,
				sector,
				updated_at: timeZoneLima(),
			},
			{ where: { id, deleted_at: null } }
		);
		return edit_costumer;

	}

	async updateByRuc(costumer) {
		const {
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			state,
			company_anniversary,
		} = costumer;
		try {
			const edit_costumer = await Costumer.update(
				{
					name,
					ruc_type,
					domain: domain ? domain : null,
					email: email ? email : null,
					phone: phone ? phone : null,
					address: address ? address : null,
					province: province ? province : null,
					country: country ? country : null,
					state: state ? state : 'ACTIVE',
					company_anniversary: company_anniversary ? company_anniversary : null,
					updated_at: timeZoneLima(),
				},
				{ where: { ruc, deleted_at: null } }
			);
			return edit_costumer;
		} catch (error) {
			return null;
		}
	}

	async delete(id) {
		const time = timeZoneLima();
		const user_deleted = await Costumer.update(
			{
				deleted_at: time,
				updated_at: time,
			},
			{ where: { id } }
		);
		return user_deleted;
	}

	async convertCSVinObject(buffer_file) {
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

	async bulkCreate(data) {
		const time = timeZoneLima();

		data.forEach((c) => {
			c['created_at'] = time;
		});
		const costumers = await Costumer.bulkCreate(data);
		return costumers;
	}

	async updateOrCreate(costumer) {
		const {
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			company_anniversary,
			state,
			manager_id,
			type
		} = costumer;
		const exist = await Costumer.findOne({ where: { ruc } });
		if (exist) {
			const updated = await exist.update({
				name,
				ruc_type,
				domain,
				email,
				phone,
				address,
				province,
				country,
				company_anniversary,
				state,
				manager_id,
				type,
				updated_at: timeZoneLima(),
			});
			return updated;
		}
		const new_costumer = Costumer.build({
			name,
			ruc_type,
			ruc,
			domain,
			email,
			phone,
			address,
			province,
			country,
			company_anniversary,
			state,
			manager_id,
			type,
			created_at: timeZoneLima(),
		});
		const n_costumer = await new_costumer.save();
		return n_costumer;
	}

	async countAll(where){
        const costumers = await Costumer.count({where})
        return costumers;
    }
}
