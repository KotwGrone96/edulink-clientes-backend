import Roles from '../models/roles.model.js';
import UserRoles from '../models/userRoles.model.js';
import { timeZoneLima } from '../timezone.js';

export default class UserRolesService {
	async assignUserRole(user_id) {
		const userRoles = UserRoles.build({
			user_id,
			rol_id: 6,
			created_at: timeZoneLima(),
		});

		try {
			const n_userRoles = await userRoles.save();
			return n_userRoles;
		} catch (error) {
			return null;
		}
	}

	async getRoles(user_id) {
		const userRoles = await UserRoles.findAll({
			where: {
				deleted_at: null,
				user_id,
			},
			include: [
				{
					model: Roles,
					attributes: ['name'],
				},
			],
		});
		return userRoles;
	}
}
