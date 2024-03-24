import Area from '../models/area.model.js';
import { timeZoneLima } from '../timezone.js';
import UserArea from '../models/userArea.model.js';
import User from '../models/user.model.js';
import { createReadStream } from 'fs';
import csv from 'csv-parser';

export default class AreaService {
	async create(area) {
		const { name, state } = area;
		const new_area = Area.build({
			name,
			state,
			created_at: timeZoneLima(),
		});
		const n_area = await new_area.save();
		return n_area;
	}

	async assign(area_id, user_id) {
		const user_area = UserArea.build({
			area_id,
			user_id,
			created_at: timeZoneLima(),
		});

		const n_user_area = await user_area.save();
		return n_user_area;
	}

	async findOne(id) {
		const area = await Area.findOne({
			where: {
				id,
				deleted_at: null,
			},
			include: {
				model: UserArea,
				include: {
					model: User,
				},
			},
		});
		return area;
	}

	async findOneRelation(user_id) {
		const area = await UserArea.findOne({
			where: {
				user_id,
				deleted_at: null,
			},
		});
		return area;
	}

	async findOneByName(name) {
		const area = await Area.findOne({
			where: {
				name,
				deleted_at: null,
			},
		});
		return area;
	}

	async findAll() {
		const areas = await Area.findAll({
			where: {
				deleted_at: null,
			},
			include: {
				model: UserArea,
			},
		});
		return areas;
	}

	async update(area) {
		const { id, name, state } = area;
		const update_area = await Area.update(
			{
				name,
				state,
				updated_at: timeZoneLima(),
			},
			{ where: { id, deleted_at: null } }
		);
		return update_area[0];
	}

	async updateNyName(area) {
		const { name, state } = area;
		const update_area = await Area.update(
			{
				state,
				updated_at: timeZoneLima(),
			},
			{ where: { name, deleted_at: null } }
		);
		return update_area[0];
	}

	async updateRelation(area_id, user_id) {
		const update_area = await UserArea.update(
			{
				area_id,
				updated_at: timeZoneLima(),
			},
			{ where: { user_id, deleted_at: null } }
		);
		return update_area[0];
	}
	async updateOrCreateUserArea(area_id, user_id) {
		const exist = await UserArea.findOne({ where: { user_id } });
		if (exist) {
			const updt = await exist.update({ area_id });
			return updt;
		}
		const new_user_area = await this.assign(area_id, user_id);
		return new_user_area;
	}

	async delete(id) {
		const time = timeZoneLima();
		const update_area = await Area.update(
			{
				updated_at: time,
				deleted_at: time,
				state: 'INACTIVE',
			},
			{ where: { id } }
		);
		return update_area[0];
	}

	async deleteRelation(area_id) {
		const time = timeZoneLima();
		const update_area = await UserArea.update(
			{
				updated_at: time,
				deleted_at: time,
			},
			{ where: { area_id } }
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

	async bulkCreate(data) {
		const time = timeZoneLima();

		data.forEach((c) => {
			c['created_at'] = time;
		});
		const areas = await Area.bulkCreate(data);
		return areas;
	}

	async getAllAreas() {
		const areas = await Area.findAll({
			where: { deleted_at: null },
			attributes: ['id', 'name'],
		});
		return areas;
	}
}
