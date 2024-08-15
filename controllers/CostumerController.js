import fs from 'fs';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { cwd } from 'process';
import { Parser } from '@json2csv/plainjs/index.js';
import {Readable} from 'stream'

export default class CostumerController {
	costumerService;
	userCostumerService;
	userService;
	updateCostumersWorkerPath;
	updateUserCostumersWorkerPath;
	webpush;
	constructor(costumerService, userCostumerService, userService, webpush) {
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
		this.webpush = webpush;
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
				'manager_id',
				'type',
				'drive_folder_id',
				'sector'
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
		const where = { deleted_at:null }
		if('type' in req.query){
			where['type'] = req.query['type'];
		}
		if('manager_id' in req.query){
			where['manager_id'] = req.query['manager_id'];
		}
		if('costumer_id' in req.query){
			where['id'] = req.query['costumer_id'];
		}
		if('sector' in req.query){
			where['sector'] = req.query['sector'];
		}

		const attributes = [
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
			'manager_id',
			'type',
			'drive_folder_id',
			'sector'
		]

		let limit = undefined;
        let offset = undefined;

        if('limit' in req.query){   
            limit = Number(req.query['limit'])
        }

        if('offset' in req.query){   
            offset = Number(req.query['offset'])
        }

		const costumers = await this.costumerService.findAll(where,attributes,limit,offset);
		return res.json({
			ok: true,
			message: 'Todos los clientes',
			costumers,
		});
	}

	async findAllAttributes(req, res) {
		const where = { deleted_at:null }
		if('type' in req.query){
			where['type'] = req.query['type'];
		}
		if('manager_id' in req.query){
			where['manager_id'] = req.query['manager_id'];
		}
		if('attributes' in req.query === false){
			return res.json({
				ok: false,
				message: 'Falta indicar los atributos',
			});
		}

		const attributes = req.query['attributes'].split('-')

		const costumers = await this.costumerService.findAll(where, attributes);
		return res.json({
			ok: true,
			message: 'Todos los clientes',
			costumers,
		});
	}

	async countAll(req, res) {
		const where = { deleted_at:null }
		if('type' in req.query){
			where['type'] = req.query['type'];
		}
		if('manager_id' in req.query){
			where['manager_id'] = req.query['manager_id'];
		}
		if('costumer_id' in req.query){
			where['id'] = req.query['costumer_id'];
		}
		if('sector' in req.query){
			where['sector'] = req.query['sector'];
		}

		try {
            const totalItems = await this.costumerService.countAll(where)
            return res.json({
                ok:true,
                message:'Todos los clientes',
                totalItems
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar los clientes',
                error
            })
        }
	}

	async findAllSimpleInfo(req, res) {
		const where = { deleted_at:null }
		if('type' in req.query){
			where['type'] = req.query['type'];
		}
		const costumers = await this.costumerService.findAllSimpleInfo(where, [
			'id',
			'name',
			'ruc',
			'ruc_type',
			'created_at',
			'state',
			'manager_id',
			'type'
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
			'ruc' in req.body == false ||
			'manager_id' in req.body == false ||
			'type' in req.body == false 

		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
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

			const exist_user = await this.userService.findOne({deleted_at:null,id:req.body['manager_id']},['id'])

			if (!exist_user) {
				return res.json({
					ok: false,
					message: 'El comercial asignado no existe',
				});
			}
			
			const new_costumer = await this.costumerService.create(req.body);
			
			if ('UserCostumers' in req.body && req.body['UserCostumers'] != null) {
				const data = [];
				req.body['UserCostumers'].forEach((user_id) => {
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
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Error al crear el cliente',
				error,
			});
		}
	}

	async update(req, res) {
		if (
			'id' in req.body == false ||
			'name' in req.body == false ||
			'ruc_type' in req.body == false ||
			'ruc' in req.body == false ||
			'manager_id' in req.body == false ||
			'type' in req.body == false 
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		try {
			await this.costumerService.update(req.body);
	
		return res.json({
			ok: true,
			message: 'Cliente actualizado',
		});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Error al actualizar cliente',
				error
			});
		}
	}

	async delete(req, res) {
		const { id } = req.params;
		
		try {
			await this.costumerService.delete(id);
		return res.json({
			ok: true,
			message: 'Cliente eliminado',
		});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Error al eliminar el cliente',
				error
			});
		}
	}

	async handleCsvFile(req, res) {
		if (!req.file) {
			return res.status(400).json({
				ok: false,
				message: 'No se ha proporcionado ningún archivo CSV',
			});
		}

		if (req.file['mimetype'].includes('csv') === false) {
			fs.unlinkSync(req.file['path']);
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
			columns.includes('state') &&
			columns.includes('type') &&
			columns.includes('manager') 
		) {
			let withError = false;
			let costumerError = null;
			let cause = null;

			const rucs_from_csv = storeCSV.map((c) => c.ruc);
			const no_dups_rucs = [...new Set(rucs_from_csv)];

			if (no_dups_rucs.length != rucs_from_csv.length) {
				withError = true;
				cause = 'Hay RUCs o DNIs duplicados en el archivo CSV';
			}

			const all_users = await this.userService.findAll({deleted_at:null},['id','email'])

			for (const c of storeCSV) {
				if (c.name.length == 0 || c.ruc_type.length == 0 || c.ruc.length == 0 || c.manager.length == 0) {
					withError = true;
					costumerError = c;
					cause = 'Faltan datos principales';
					break;
				}
				const manager = all_users.find(u=>u.email=== c.manager)

				if(!manager){
					withError = true;
					costumerError = c;
					cause = `El correo de usuario ${c.manager} no existe`;
					break;
				}

				c.domain = c.domain.length == 0 ? null : c.domain;
				c.email = c.email.length == 0 ? null : c.email;
				c.phone = c.phone.length == 0 ? null : c.phone;
				c.address = c.address.length == 0 ? null : c.address;
				c.province = c.province.length == 0 ? null : c.province;
				c.country = c.country.length == 0 ? null : c.country;
				c.company_anniversary =
					c.company_anniversary.length == 0 ? null : c.company_anniversary;
				c.state = c.state.length == 0 ? 'ACTIVE' : c.state;
				c.type = c.type.length == 0 ? 'LEAD' : c.type;
				c['manager_id'] = manager.id
			}

			

			if (withError) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: cause,
					costumerError,
					
				});
			}

			const worker = new Worker(this.updateCostumersWorkerPath, {
				workerData: {
					data: storeCSV,
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

			worker.on('exit', async (exitCode) => {
				if (exitCode != 0) {
					fs.unlinkSync(req.file['path']);
					console.log('Código de salida ===> ', exitCode);
					if ('subscription' in req.body) {
						const subscription = await JSON.parse(req.body['subscription']);

						await this.webpush.sendNotification(
							subscription,
							JSON.stringify({
								ok: false,
								message:
									'Error en el servidor, no se ha podido importar a los clientes',
								title: 'EDULINK - CSV DE CLIENTES',
							})
						);
					}
					return;
				}
				fs.unlinkSync(req.file['path']);
				console.log('Clientes importados exitosamente');
				if ('subscription' in req.body) {
					const subscription = await JSON.parse(req.body['subscription']);

					await this.webpush.sendNotification(
						subscription,
						JSON.stringify({
							ok: true,
							message: 'CSV de clientes importado exitosamente',
							title: 'EDULINK - CSV DE CLIENTES',
						})
					);
				}
			});

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
				console.log('Comerciales de clientes importados exitosamente');
			});

			return res.json({
				ok: true,
				message:
					'Importando a los comerciales de los clientes, le avisaremos cuando el proceso termine',
			});
		}
		fs.unlinkSync(req.file['path']);
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}

	async assignManagers(req, res) {
		if ('usersCostumers' in req.body == false) {
			return res.json({ ok: false, message: 'No se han enviado usuarios' });
		}
		if (req.body['usersCostumers'].length === 0) {
			return res.json({ ok: false, message: 'No se han enviado usuarios' });
		}

		try {
			const data = req.body['usersCostumers'];
			data.forEach(async (d) => {
				const { user_id, costumer_id } = d;
				await this.userCostumerService.updateOrCreateUserCostumer(
					user_id,
					costumer_id
				);
			});
			return res.json({
				ok: true,
				message: 'Comerciales asignados',
			});
		} catch (error) {
			return res.json({
				ok: true,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async deleteManager(req, res) {
		if ('user_id' in req.body == false || 'costumer_id' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const del_manager = await this.userCostumerService.delete(
				req.body['user_id'],
				req.body['costumer_id']
			);

			return res.json({
				ok: true,
				message: 'Comercial retirado',
				del_manager,
			});
		} catch (error) {
			return res.json({
				ok: true,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async csvAllData(req, res){
		const where = {
			deleted_at:null
		}

		if('type' in req.query){
			where['type'] = req.query['type'];
		}
		if('manager_id' in req.query){
			where['manager_id'] = req.query['manager_id'];
		}
		if('costumer_id' in req.query){
			where['id'] = req.query['costumer_id'];
		}
		if('sector' in req.query){
			where['sector'] = req.query['sector'];
		}

		const attributes = [
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
			'country',
			'state',
			'manager_id',
			'type',
			'drive_folder_id',
			'sector'
		]
		const costumers = await this.costumerService.findAll(where,attributes)
		const arrayCostumers = costumers.map(c=>c.dataValues)
		const translates = {
			ACTIVE:'Activo',
			INACTIVE:'Inactivo',
			COSTUMER:'Cliente',
			LEAD:'Prospecto',
			CORPORATE:'Corporativo',
			EDUCATIONAL:'Educativo',
			NATURAL_PERSON:'Persona natural'
		}

		const filterData = arrayCostumers.map(c=>{
			const costumerFilter = {
				'ID':c.id,
				'Nombre':c.name,
				'Dominio':c.domain,
				'Teléfono':c.phone,
				'Correo':c.email,
				'Dirección':c.address,
				'Provincia':c.province,
				'Aniversario del cliente':c.company_anniversary,
				'Documento':c.ruc,
				'Tipo de documento':c.ruc_type,
				'País':c.country,
				'Estado':translates[c.state],
				'ID de encargado comercial':c.manager_id,
				'Encargado comercial':`${c.User.name} ${c.User.lastname}`,
				'Tipo de cliente':translates[c.type],
				'Google Drive':c.drive_folder_id,
				'Sector':translates[c.sector]
			}
			// attributes.forEach(attr=>{
			// 	costumerFilter[attr] = c[attr]
			// })
			return costumerFilter
		})

		try {
			const opts = {};
			const parser = new Parser(opts);
			const csv = parser.parse(filterData);
			res.set({
                'Content-Type':'text/csv',
                'Content-Disposition':`attachment; filename="prueba.csv"`
            })
			const readStream = new Readable({encoding:'utf-8'})
			readStream.push(csv,'utf-8')
			readStream.push(null)
			
			readStream.pipe(res)
		  } catch (err) {
			console.error(err);
		  }
	}

	async updateUserCostumers(req, res){
		if (
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			await this.userCostumerService.update(req.body)
			return res.json({
				ok:true,
				message:'Actualizado correctamente'
			})
			
		} catch (error) {
			console.error(error);
			return res.json({
				ok:false,
				message:'Error en el servidor',
				error
			})
		}
	}
}
