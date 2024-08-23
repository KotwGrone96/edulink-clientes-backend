import UserCostumer from '../models/userCostumer.model.js';
import User from '../models/user.model.js';
import Costumer from '../models/costumer.model.js';
import { timeZoneLima } from '../timezone.js';

export default class UserCostumerService {
	async findAll(where, attributes) {
		const userCostumers = await UserCostumer.findAll({
			where,
			attributes,
			include: [
				{
					model: User,
					include: ['id', 'name', 'lastname', 'email', 'state'],
				},
				{
					model: Costumer,
					include: ['id', 'name', 'ruc_type', 'ruc', 'state'],
				},
			],
		});
		return userCostumers;
	}

	async findOne(where, attributes) {
		const userCostumer = await UserCostumer.findOne({
			where,
			attributes,
			include: [
				{
					model: User,
					include: ['id', 'name', 'lastname', 'email', 'state'],
				},
				{
					model: Costumer,
					include: ['id', 'name', 'ruc_type', 'ruc', 'state'],
				},
			],
		});
		return userCostumer;
	}

	async assignUserCostumer(user_id, costumer_id,hasDriveAccess) {
		const userCostumer = UserCostumer.build({
			user_id,
			costumer_id,
			hasDriveAccess,
			created_at: timeZoneLima(),
		});

		try {
			const n_userCostumer = await userCostumer.save();
			return n_userCostumer;
		} catch (error) {
			return null;
		}
	}

	async delete(user_id, costumer_id) {
		const userCostumerDel = await UserCostumer.destroy({
			where: { user_id, costumer_id },
		});
		return userCostumerDel;
	}

	async updateOrCreateUserCostumer(user_id, costumer_id, hasDriveAccess) {
		const exist = await UserCostumer.findOne({
			where: { user_id, costumer_id },
		});
		if (exist) return exist;

		const new_userCostumer = await this.assignUserCostumer(
			user_id,
			costumer_id,
			hasDriveAccess
		);
		return new_userCostumer;
	}

	async bulkCreate(data) {
		const time = timeZoneLima();

		data.forEach((c) => {
			c['created_at'] = time;
		});
		const userCostumers = await UserCostumer.bulkCreate(data);
		return userCostumers;
	}

	async update(userCostumer){
		const { user_id, costumer_id, hasDriveAccess } = userCostumer
		const updt_userCostumer = await UserCostumer.update({
			hasDriveAccess,
			updated_at:timeZoneLima()
		},{where:{ user_id, costumer_id, }})

		return updt_userCostumer
	}

}
