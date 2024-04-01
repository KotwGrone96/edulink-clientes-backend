import fs from 'fs';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { cwd } from 'process';

export default class CostumerController {
	costumerService;
	userCostumerService;
	userService;
	updateCostumersWorkerPath;
	updateUserCostumersWorkerPath;
	constructor(costumerService, userCostumerService, userService) {
		this.costumerService = costumerService;
		this.userCostumerService = userCostumerService;
		this.userService = userService;
		this.updateCostumersWorkerPath = join(
			cwd(),
			'workers',
			'updateCostumers.js'
		);
		this.updateUserCostumersWorkerPath = join(
			cwd(),
			'workers',
			'updateUserCostumers.js'
		);
	}

	async findOne(req, res) {
		const { id } = req.params;
		const costumer = await this.costumerService.findOne(
			{
				id,
				deleted_at: null,
			},
			[
				'id',
				'name',
				'domain',
				'phone',
				'email',
				'address',
				'province',
				'company_anniversary',
				'ruc',
				'ruc_type',
				'created_at',
				'country',
				'state',
			]
		);
		if (!costumer) {
			return res.json({
				ok: false,
				message: 'No se ha encontrado el cliente',
			});
		}
		return res.json({
			ok: true,
			message: 'Usuario encontrado',
			costumer,
		});
	}

	async findAll(req, res) {
		const costumers = await this.costumerService.findAll({ deleted_at: null }, [
			'id',
			'name',
			'domain',
			'phone',
			'email',
			'address',
			'province',
			'company_anniversary',
			'ruc',
			'ruc_type',
			'created_at',
			'country',
			'state',
		]);
		return res.json({
			ok: true,
			message: 'Todos los clientes',
			costumers,
		});
	}

	async create(req, res) {
		if (
			'name' in req.body == false ||
			'ruc_type' in req.body == false ||
			'ruc' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const exist = await this.costumerService.findOne(
			{
				deleted_at: null,
				ruc: req.body.ruc,
			},
			['ruc']
		);

		if (exist) {
			return res.json({
				ok: false,
				message: 'Este ruc ya fue registrado',
			});
		}
		const new_costumer = await this.costumerService.create(req.body);
		if (!new_costumer) {
			return res.json({
				ok: false,
				message: 'Error al crear cliente nuevo',
			});
		}

		if ('sales_manager' in req.body) {
			const data = [];
			req.body['sales_manager'].forEach((user_id) => {
				const obj = { user_id: '', costumer_id: '' };
				obj.user_id = user_id;
				obj.costumer_id = new_costumer.id;
				data.push(obj);
			});
			await this.userCostumerService.bulkCreate(data);
		}
		return res.json({
			ok: true,
			message: 'Cliente creado correctamente',
			costumer: new_costumer,
		});
	}

	async update(req, res) {
		if (
			'id' in req.body == false ||
			'name' in req.body == false ||
			'ruc_type' in req.body == false ||
			'ruc' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		const costumer_updated = await this.costumerService.update(req.body);
		if (!costumer_updated) {
			return res.json({
				ok: false,
				message: 'Error al actualizar cliente',
			});
		}

		return res.json({
			ok: true,
			message: 'Cliente actualizado',
		});
	}

	async delete(req, res) {
		const { id } = req.params;
		const del_user = await this.costumerService.delete(id);
		if (!del_user) {
			return res.json({
				ok: false,
				message: 'Error al eliminar el cliente',
			});
		}
		return res.json({
			ok: true,
			message: 'Cliente eliminado',
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

		const storeCSV = await this.costumerService.convertCSVinObject(
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
			columns.includes('ruc_type') &&
			columns.includes('ruc') &&
			columns.includes('domain') &&
			columns.includes('email') &&
			columns.includes('phone') &&
			columns.includes('address') &&
			columns.includes('province') &&
			columns.includes('country') &&
			columns.includes('company_anniversary') &&
			columns.includes('state')
		) {
			const current_costumers = await this.costumerService.findAll(
				{ deleted_at: null },
				['id', 'ruc']
			);

			const to_update_list = [];
			const to_create_list = [];
			let withError = false;
			let costumerError = null;
			let cause = null;

			for (const c of storeCSV) {
				if (c.name.length == 0 || c.ruc_type.length == 0 || c.ruc.length == 0) {
					withError = true;
					costumerError = c;
					cause = 'Faltan datos principales';
					break;
				}

				// if (c.rol.length != 0 && current_roleNames.includes(c.rol) == false) {
				// 	withError = true;
				// 	costumerError = c;
				// 	cause = 'El rol no existe';
				// 	break;
				// }

				// if (c.area.length != 0 && current_areaNames.includes(c.area) == false) {
				// 	withError = true;
				// 	costumerError = c;
				// 	cause = 'El área no existe';
				// 	break;
				// }

				let founded = false;
				const ruc = c.ruc;
				c.domain = c.domain.length == 0 ? null : c.domain;
				c.email = c.email.length == 0 ? null : c.email;
				c.phone = c.phone.length == 0 ? null : c.phone;
				c.address = c.address.length == 0 ? null : c.address;
				c.province = c.province.length == 0 ? null : c.province;
				c.country = c.country.length == 0 ? null : c.country;
				c.company_anniversary =
					c.company_anniversary.length == 0 ? null : c.company_anniversary;
				c.state = c.state.length == 0 ? 'ACTIVE' : c.state;

				for (const c2 of current_costumers) {
					if (ruc == c2.ruc) {
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
					costumerError,
					cause,
				});
			}

			const worker = new Worker(this.updateCostumersWorkerPath, {
				workerData: {
					to_update_list,
					to_create_list,
				},
			});

			worker.on('error', (err) => {
				console.log('ERROR EN EL WORKER DE COSTUMERS');
				console.log(err);
			});

			worker.on('message', (data) => {
				const { created_users, updated_users } = data;
				console.log('Clientes creados: ' + created_users);
				console.log('Clientes actualizados: ' + updated_users);
			});

			worker.on('exit', () => {
				fs.unlinkSync(req.file['path']);
				console.log('Clientes importados exitosamente');
			});

			// const current_users = await this.costumerService.findAll();

			// const current_roles = await this.userRolesService.getAllRoles();
			// const current_roleNames = current_roles.map((cr) => cr.name);

			// const current_areas = await this.areaService.getAllAreas();
			// const current_areaNames = current_areas.map((ca) => ca.name);

			// const to_update_list = [];
			// const to_create_list = [];
			// let withError = false;
			// let userError = null;
			// let cause = null;

			// for (const c of storeCSV) {
			// 	if (c.name.length == 0 || c.lastname.length == 0 || c.name.email == 0) {
			// 		withError = true;
			// 		userError = c;
			// 		cause = 'Faltan datos principales';
			// 		break;
			// 	}

			// 	if (c.rol.length != 0 && current_roleNames.includes(c.rol) == false) {
			// 		withError = true;
			// 		userError = c;
			// 		cause = 'El rol no existe';
			// 		break;
			// 	}

			// 	if (c.area.length != 0 && current_areaNames.includes(c.area) == false) {
			// 		withError = true;
			// 		userError = c;
			// 		cause = 'El área no existe';
			// 		break;
			// 	}

			// 	let founded = false;
			// 	const email = c.email;
			// 	c.state = c.state.length == 0 ? 'ACTIVE' : c.state;
			// 	c.dni = c.dni.length == 0 ? null : c.dni;
			// 	c.phone = c.phone.length == 0 ? null : c.phone;
			// 	c.address = c.address.length == 0 ? null : c.address;
			// 	c.province = c.province.length == 0 ? null : c.province;
			// 	c.country = c.country.length == 0 ? null : c.country;
			// 	c.rol = c.rol.length == 0 ? 'USER' : c.rol;
			// 	c.area = c.area.length == 0 ? 'N/A' : c.area;

			// 	for (const c2 of current_users) {
			// 		if (email == c2.email) {
			// 			to_update_list.push(c);
			// 			founded = true;
			// 			break;
			// 		}
			// 	}

			// 	if (!founded) {
			// 		to_create_list.push(c);
			// 	}
			// }

			// if (withError) {
			// 	fs.unlinkSync(req.file['path']);
			// 	return res.json({
			// 		ok: false,
			// 		message: 'Hay errores en el contenido del archivo CSV',
			// 		userError,
			// 		cause,
			// 	});
			// }

			// const all_roles = current_roles.map((e) => {
			// 	return { id: e.id, name: e.name };
			// });

			// const all_areas = current_areas.map((e) => {
			// 	return { id: e.id, name: e.name };
			// });

			// const worker = new Worker(this.updateCostumersWorkerPath, {
			// 	workerData: {
			// 		to_update_list,
			// 		to_create_list,
			// 		all_roles,
			// 		all_areas,
			// 	},
			// });

			// worker.on('error', (err) => {
			// 	console.log('ERROR EN EL WORKER');
			// 	console.log(err);
			// });

			// worker.on('message', (data) => {
			// 	const { created_users, updated_users } = data;
			// 	console.log('Usuario creados: ' + created_users);
			// 	console.log('Usuario actualizados: ' + updated_users);
			// });

			// worker.on('exit', () => {
			// 	fs.unlinkSync(req.file['path']);
			// 	console.log('Usuarios importados exitosamente');
			// });

			return res.json({
				ok: true,
				message:
					'Importando clientes, le avisaremos cuando finalice el proceso',
			});
		}
		fs.unlinkSync(req.file['path']);

		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}

	async assignManagerCSV(req, res) {
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

		const storeCSV = await this.costumerService.convertCSVinObject(
			req.file['path']
		);

		if (!storeCSV) {
			fs.unlinkSync(req.file['path']);
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (storeCSV.length == 0) {
			fs.unlinkSync(req.file['path']);
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(storeCSV[0]);

		if (columns.includes('ruc') && columns.includes('email')) {
			const current_users = await this.userService.findAll(
				{ deleted_at: null },
				['id', 'email']
			);

			//***** VALIDACIÓN DE CORREOS *****//
			const emails_to_validate = storeCSV.map((c) => c.email);
			const no_duplicates_emails = [...new Set(emails_to_validate)];

			let user_not_exist = null;

			const users_will_assign = [];

			for (const no_dup_email of no_duplicates_emails) {
				let founded = false;
				for (const c_user of current_users) {
					if (c_user.email == no_dup_email) {
						founded = true;
						users_will_assign.push({ id: c_user.id, email: c_user.email });
						break;
					}
				}
				if (!founded) {
					user_not_exist = no_dup_email;
					break;
				}
			}

			if (user_not_exist) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: 'El usuario no existe',
					email: user_not_exist,
				});
			}

			//***** VALIDACIÓN DE RUC *****//

			const current_costumers = await this.costumerService.findAll(
				{ deleted_at: null },
				['id', 'ruc']
			);
			const costumers_to_validate = storeCSV.map((c) => c.ruc);
			const no_duplicates_costumers = [...new Set(costumers_to_validate)];

			let costumer_not_exist = null;
			const costumers_will_assign = [];

			for (const no_dup_costumer of no_duplicates_costumers) {
				let founded = false;
				for (const c_costumer of current_costumers) {
					if (c_costumer.ruc == no_dup_costumer) {
						founded = true;
						costumers_will_assign.push({
							id: c_costumer.id,
							ruc: c_costumer.ruc,
						});
						break;
					}
				}
				if (!founded) {
					costumer_not_exist = no_dup_costumer;
					break;
				}
			}

			if (costumer_not_exist) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: 'El cliente no existe',
					ruc: costumer_not_exist,
				});
			}

			const workerData = [];

			for (const csv of storeCSV) {
				const { email, ruc } = csv;
				const obj = { user_id: '', costumer_id: '' };

				for (const uwa of users_will_assign) {
					if (email == uwa.email) {
						obj['user_id'] = uwa.id;
						break;
					}
				}
				for (const cwa of costumers_will_assign) {
					if (ruc == cwa.ruc) {
						obj['costumer_id'] = cwa.id;
						break;
					}
				}
				workerData.push(obj);
			}

			//return res.json({ workerData });

			const worker = new Worker(this.updateUserCostumersWorkerPath, {
				workerData: { data: workerData },
			});

			worker.on('error', (err) => {
				console.log('ERROR EN EL WORKER DE COSTUMERS');
				console.log(err);
			});

			worker.on('message', (data) => {
				console.log(data);
			});

			worker.on('exit', () => {
				fs.unlinkSync(req.file['path']);
				console.log('Encargados de clientes importados exitosamente');
			});

			return res.json({
				ok: true,
				message:
					'Importando a los encargados de los clientes, le avisaremos cuando el proceso termine',
			});
		}
		fs.unlinkSync(req.file['path']);
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
