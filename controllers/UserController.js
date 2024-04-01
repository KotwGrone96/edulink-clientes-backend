import fs from 'fs';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { cwd } from 'process';

export default class UserController {
	userService;
	userRolesService;
	updateUsersWorkerPath;
	areaService;
	constructor(userService, userRolesService, areaService) {
		this.userService = userService;
		this.userRolesService = userRolesService;
		this.updateUsersWorkerPath = join(cwd(), 'workers', 'updateUsers.js');
		this.areaService = areaService;
	}

	async validateUser(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'email' in req.body == false ||
			'gid' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		//TODO ***** [ CREACIÓN DE USUARIO ] *****//
		let user = await this.userService.findOneByEmail(req.body.email);
		if (!user) {
			user = await this.userService.create(req.body);
			if (!user) {
				return res.json({
					ok: false,
					message: 'Error al crear al usuario',
				});
			}
		}

		if (user.state === 'INACTIVE') {
			return res.json({
				ok: false,
				message: 'El usuario ha sido suspendido',
			});
		}

		// //TODO ***** [ CREACIÓN DE ROL ] *****//
		if ('UserRoles' in user == false) {
			const user_rol = await this.userRolesService.assignUserRole(user.id);
			const UserRoles = [
				{
					id: user_rol.id,
					user_id: user_rol.user_id,
					rol_id: user_rol.rol_id,
					Role: {
						name: 'USER',
					},
				},
			];
			user.dataValues['UserRoles'] = UserRoles;
		}
		if ('UserRoles' in user && user['UserRoles'].length === 0) {
			const user_rol = await this.userRolesService.assignUserRole(user.id);
			const UserRoles = [
				{
					id: user_rol.id,
					user_id: user_rol.user_id,
					rol_id: user_rol.rol_id,
					Role: {
						name: 'USER',
					},
				},
			];
			user.dataValues['UserRoles'] = UserRoles;
		}

		// //TODO ***** [ CREACIÓN DE GID ] *****//
		let user_gid = await this.userService.findOneByGID(req.body.gid);
		if (!user_gid) {
			user_gid = await this.userService.updateGID({
				user_id: user.id,
				gid: req.body.gid,
			});
			if (!user_gid) {
				return res.json({
					ok: false,
					message: 'Error al crear el GID del usuario',
				});
			}
		}

		return res.json({
			ok: true,
			message: 'Usuario agregado',
			user,
		});
	}

	async create(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'email' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const exist = await this.userService.findOneByEmail(req.body['email']);

		if (exist) {
			return res.json({
				ok: false,
				message: 'Este correo ya fue registrado',
			});
		}

		const new_user = await this.userService.create(req.body);
		if (!new_user) {
			return res.json({
				ok: false,
				message: 'Error al crear al usuario',
			});
		}

		const user_rol = await this.userRolesService.assignUserRole(new_user.id);
		const UserRoles = [
			{
				id: user_rol.id,
				user_id: user_rol.user_id,
				rol_id: user_rol.rol_id,
				Role: {
					name: 'USER',
				},
			},
		];
		new_user.dataValues['UserRoles'] = UserRoles;

		return res.json({
			ok: true,
			message: 'Usuario agregado',
			user: new_user,
		});
	}

	async findAll(req, res) {
		const users = await this.userService.findAll({ deleted_at: null }, [
			'id',
			'name',
			'lastname',
			'email',
			'phone',
			'address',
			'dni',
			'province',
			'country',
			'state',
			'created_at',
		]);
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

	async delete(req, res) {
		const { id } = req.params;
		const del_user = await this.userService.delete(id);
		if (!del_user) {
			return res.json({
				ok: false,
				message: 'Error al eliminar el usuario',
			});
		}
		return res.json({
			ok: true,
			message: 'Usuario eliminado',
		});
	}

	async updateRole(req, res) {
		const rol = await this.userRolesService.getRoleByName(req.body.rolname);
		if (!rol) {
			return res.json({
				ok: false,
				message: 'No se encontró el rol',
			});
		}

		const rol_updated = await this.userRolesService.updateRole(
			req.body.user_id,
			rol.id
		);

		if (!rol_updated) {
			return res.json({
				ok: false,
				message: 'Error al actualizar el rol',
			});
		}
		return res.json({
			ok: true,
			message: 'Rol actualizado',
		});
	}

	async update(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'email' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		await this.userService.update(req.body);

		return res.json({
			ok: true,
			message: 'Usuario actualizado',
		});
	}

	async handleCsvFile(req, res) {
		if (!req.file) {
			return res.status(400).json({
				ok: false,
				message: 'No se ha proporcionado ningún archivo CSV',
			});
		}

		if (req.file['mimetype'].includes('csv') === false) {
			return res.json({
				ok: false,
				message: 'El archivo ingresado no es un CSV',
			});
		}

		const storeCSV = await this.userService.convertCSVinObject(
			req.file['path']
		);

		if (!storeCSV) {
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (storeCSV.length == 0) {
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(storeCSV[0]);

		if (
			columns.includes('name') &&
			columns.includes('lastname') &&
			columns.includes('email') &&
			columns.includes('phone') &&
			columns.includes('address') &&
			columns.includes('dni') &&
			columns.includes('province') &&
			columns.includes('country') &&
			columns.includes('state') &&
			columns.includes('rol') &&
			columns.includes('area')
		) {
			const current_users = await this.userService.findAll(
				{ deleted_at: null },
				[
					'id',
					'name',
					'lastname',
					'email',
					'phone',
					'address',
					'dni',
					'province',
					'country',
					'state',
					'created_at',
				]
			);

			const current_roles = await this.userRolesService.getAllRoles();
			const current_roleNames = current_roles.map((cr) => cr.name);

			const current_areas = await this.areaService.getAllAreas();
			const current_areaNames = current_areas.map((ca) => ca.name);

			const to_update_list = [];
			const to_create_list = [];
			let withError = false;
			let userError = null;
			let cause = null;

			for (const c of storeCSV) {
				if (
					c.name.length == 0 ||
					c.lastname.length == 0 ||
					c.email.length == 0
				) {
					withError = true;
					userError = c;
					cause = 'Faltan datos principales';
					break;
				}

				if (c.rol.length != 0 && current_roleNames.includes(c.rol) == false) {
					withError = true;
					userError = c;
					cause = 'El rol no existe';
					break;
				}

				if (c.area.length != 0 && current_areaNames.includes(c.area) == false) {
					withError = true;
					userError = c;
					cause = 'El área no existe';
					break;
				}

				let founded = false;
				const email = c.email;
				c.state = c.state.length == 0 ? 'ACTIVE' : c.state;
				c.dni = c.dni.length == 0 ? null : c.dni;
				c.phone = c.phone.length == 0 ? null : c.phone;
				c.address = c.address.length == 0 ? null : c.address;
				c.province = c.province.length == 0 ? null : c.province;
				c.country = c.country.length == 0 ? null : c.country;
				c.rol = c.rol.length == 0 ? 'USER' : c.rol;
				c.area = c.area.length == 0 ? 'N/A' : c.area;

				for (const c2 of current_users) {
					if (email == c2.email) {
						to_update_list.push(c);
						founded = true;
						break;
					}
				}

				if (!founded) {
					to_create_list.push(c);
				}
			}

			if (withError) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: 'Hay errores en el contenido del archivo CSV',
					userError,
					cause,
				});
			}

			const all_roles = current_roles.map((e) => {
				return { id: e.id, name: e.name };
			});

			const all_areas = current_areas.map((e) => {
				return { id: e.id, name: e.name };
			});

			const worker = new Worker(this.updateUsersWorkerPath, {
				workerData: {
					to_update_list,
					to_create_list,
					all_roles,
					all_areas,
				},
			});

			worker.on('error', (err) => {
				console.log('ERROR EN EL WORKER');
				console.log(err);
			});

			worker.on('message', (data) => {
				const { created_users, updated_users } = data;
				console.log('Usuarios creados: ' + created_users);
				console.log('Usuarios actualizados: ' + updated_users);
			});

			worker.on('exit', () => {
				fs.unlinkSync(req.file['path']);
				console.log('Usuarios importados exitosamente');
			});

			return res.json({
				ok: true,
				message:
					'Importando usuarios, le avisaremos cuando finalice el proceso',
			});
		}
		fs.unlinkSync(req.file['path']);

		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
