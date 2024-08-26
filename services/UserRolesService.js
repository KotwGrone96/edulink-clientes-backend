import Roles from '../models/roles.model.js';
import RouteByRol from '../models/routesByRole.model.js';
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
	async assignRole(user_id, rol_id) {
		const userRoles = UserRoles.build({
			user_id,
			rol_id,
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
					attributes: ['name','label'],
				},
			],
		});
		return userRoles;
	}

	async getAllRoles() {
		const roles = await Roles.findAll({
			where: { deleted_at: null },
			attributes: ['id', 'name','label'],
			include:[
				{
					model:RouteByRol
				}
			]
		});
		return roles;
	}

	async getRoleByName(name) {
		const rol = await Roles.findOne({
			where: { name, deleted_at: null },
		});
		return rol;
	}

	async updateRole(user_id, rol_id) {
		const rol_updated = await UserRoles.update(
			{
				rol_id,
			},
			{ where: { user_id, deleted_at: null } }
		);
		return rol_updated;
	}

	async updateOrCreateUserRol(user_id, rol_id) {
		const exist = await UserRoles.findOne({ where: { user_id } });
		if (exist) {
			const updt = await exist.update({ rol_id });
			return updt;
		}
		const new_rol = await this.assignRole(user_id, rol_id);
		return new_rol;
	}

	async delete(where) {
		const delUserRole = await UserRoles.destroy({where})
		return delUserRole
	}
}
