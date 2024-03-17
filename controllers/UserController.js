export default class UserController {
	userService;
	userRolesService;
	constructor(userService, userRolesService) {
		this.userService = userService;
		this.userRolesService = userRolesService;
	}

	async validateUser(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'email' in req.body == false ||
			'gid' in req.body == false ||
			'domain' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const user = await this.userService.findOneByGID(req.body.gid);

		if (user) {
			const roles = await this.userRolesService.getRoles(user.id);
			if (roles.length === 0) {
				await this.userRolesService.assignUserRole(user.id);
			}

			return res.json({
				ok: true,
				message: 'Usuario encontrado',
				user,
			});
		}
		const new_user = await this.userService.create(req.body);
		if (!new_user) {
			return res.json({
				ok: false,
				message: 'Error al crear al usuario',
			});
		}
		await this.userRolesService.assignUserRole(new_user.id);
		return res.json({
			ok: true,
			message: 'Usuario agregado',
			user: new_user,
		});
	}

	async findAll(req, res) {
		const users = await this.userService.findAll();
		return res.json({
			ok: true,
			message: 'Todos los usuarios',
			users,
		});
	}

	async getRoles(req, res) {
		if ('id' in req.params == false) {
			return res.json({
				ok: false,
				message: 'Debe ingresar el ID del usuario',
			});
		}

		const roles = await this.userRolesService.getRoles(req.params['id']);
		return res.json({
			ok: true,
			message: 'Todos los roles',
			roles,
		});
	}
}
