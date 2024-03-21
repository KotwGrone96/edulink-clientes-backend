import Area from '../models/area.model.js';
import { timeZoneLima } from '../timezone.js';
import UserArea from '../models/userArea.model.js';
import User from '../models/user.model.js';

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
		const { id, name } = area;
		const update_area = await Area.update(
			{
				name,
				updated_at: timeZoneLima(),
			},
			{ where: { id, deleted_at: null } }
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
}
