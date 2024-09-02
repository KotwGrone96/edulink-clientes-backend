import fs from 'fs';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { cwd } from 'process';
import { Parser } from '@json2csv/plainjs/index.js';
import {Readable} from 'stream'

export default class ContactInfoController {
	contactInfoService;
	costumerService;
	updateContactWorkerPath;
	webpush;
	constructor(contactInfoService, costumerService, webpush) {
		this.contactInfoService = contactInfoService;
		this.costumerService = costumerService;
		this.updateContactWorkerPath = join(cwd(), 'workers', 'updateContacts.js');
		this.webpush = webpush;
	}

	async create(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'phone' in req.body == false ||
			'email' in req.body == false ||
			'rol' in req.body == false ||
			'costumer_id' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const { email, costumer_id } = req.body;

		const alreadyExist = await this.contactInfoService.findOne({
			email,
			costumer_id,
			deleted_at: null,
		});
		if (alreadyExist) {
			return res.json({
				ok: false,
				message: 'Este correo ya fue registrado',
			});
		}
		const new_contactInfo = await this.contactInfoService.create(req.body);
		if (!new_contactInfo) {
			return res.json({
				ok: false,
				message: 'Error al crear contacto',
			});
		}
		return res.json({
			ok: true,
			message: 'Contacto creado correctamente',
			contactInfo: new_contactInfo,
		});
	}

	async findAllOfCostumer(req, res) {
		if ('id' in req.params == false) {
			return res.json({ ok: false, message: 'Falta el ID del cliente' });
		}
		const contacts = await this.contactInfoService.findAll({
			costumer_id: req.params.id,
			deleted_at: null,
		});
		return res.json({
			ok: true,
			message: 'Todos los contactos del cliente',
			contacts,
		});
	}

	async delete(req, res) {
		const { id } = req.params;
		try {
			const rows = await this.contactInfoService.delete(id);

			return res.json({
				ok: true,
				message: 'Contacto eliminado correctamente',
				rows,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al eliminar el Contacto',
				error,
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
			return res.json({
				ok: false,
				message: 'El archivo ingresado no es un CSV',
			});
		}

		const storeCSV = await this.contactInfoService.convertCSVinObject(
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
			columns.includes('ruc') &&
			columns.includes('name') &&
			columns.includes('lastname') &&
			columns.includes('email') &&
			columns.includes('phone') &&
			columns.includes('rol')
		) {
			let withErros = false;
			let lineError = null;
			let cause = null;

			for (const c of storeCSV) {
				let line = 2;
				if (
					c.ruc.length == 0 ||
					c.name.length == 0 ||
					c.lastname.length == 0 ||
					c.email.length == 0 ||
					c.phone.length == 0 ||
					c.rol.length == 0
				) {
					withErros = true;
					lineError = line;
					cause = 'Faltan datos principales';
					break;
				}
				line += 1;
			}

			if (withErros) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: 'Hay errores en el archivo CSV',
					cause,
					lineError,
				});
			}

			const current_costumers = await this.costumerService.findAll(
				{ deleted_at: null },
				['id', 'ruc']
			);

			const current_rucs = current_costumers.map((cc) => cc.ruc);

			for (const c of storeCSV) {
				if (c.ruc.length != 0 && current_rucs.includes(c.ruc) == false) {
					withErros = true;
					cause = `El ruc ${c.ruc} no existe como cliente en la base de datos`;
					break;
				}
			}

			if (withErros) {
				fs.unlinkSync(req.file['path']);
				return res.json({
					ok: false,
					message: 'Hay errores en el archivo CSV',
					cause,
				});
			}

			const data = [];

			for (const c of storeCSV) {
				const ruc = c.ruc;
				for (const c2 of current_costumers) {
					if (c2.ruc == ruc) {
						c['costumer_id'] = c2.id;
						data.push(c);
						break;
					}
				}
			}

			const worker = new Worker(this.updateContactWorkerPath, {
				workerData: {
					data,
				},
			});

			worker.on('error', (err) => {
				fs.unlinkSync(req.file['path']);
				console.log('ERROR EN EL WORKER DE CONTACTOS');
				console.log(err);
			});

			worker.on('message', (data) => {
				console.log(data);
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
									'Error en el servidor, no se ha podido importar a los contactos de los clientes',
								title: 'EDULINK - CSV DE CONTACTOS DE CLIENTES',
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
							message: 'CSV de contacto de clientes importado exitosamente',
							title: 'EDULINK - CSV DE CONTACTOS DE CLIENTES',
						})
					);
				}
			});

			return res.json({
				ok: true,
				message:
					'Importando contactos, le avisaremos cuando termine el proceso',
			});
		}
		fs.unlinkSync(req.file['path']);

		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}

	async update(req, res) {
		if (
			'name' in req.body == false ||
			'lastname' in req.body == false ||
			'phone' in req.body == false ||
			'email' in req.body == false ||
			'rol' in req.body == false ||
			'id' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const rows = await this.contactInfoService.update(req.body);
			return res.json({
				ok: true,
				message: 'Contacto actualizado',
				rows,
			});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Hubo un error en el servidor',
				error,
			});
		}
	}

	async csvAllData(req, res){
		const where = {
			deleted_at:null
		}

		const contacts = await this.contactInfoService.findAll(where)
		const arrayContacts = contacts.map(c=>c.dataValues)

		const translates = {
			CORPORATE:'Corporativo',
			EDUCATIONAL:'Educativo',
			NATURAL_PERSON:'Persona natural'
		}

		const filterData = arrayContacts.map(c=>{
			const contactFilter = {
				'Cliente':c.Costumer.name,
				'Documento':c.Costumer.ruc,
				'Dominio':c.Costumer.domain,
				'Sector':c.Costumer.sector?translates[c.Costumer.sector]:"",
				'Contacto':`${c.name} ${c.lastname}`,
				'Teléfono':c.phone,
				'Correo':c.email,
				'Cargo':c.rol,
				'Encargado comercial':`${c.Costumer.User.name} ${c.Costumer.User.lastname}`
			}
			
			return contactFilter
		})

		try {
			const opts = {};
			const parser = new Parser(opts);
			const csv = parser.parse(filterData);
			res.set({
                'Content-Type':'text/csv',
                'Content-Disposition':`attachment; filename="contactos.csv"`
            })
			const readStream = new Readable({encoding:'utf-8'})
			readStream.push(csv,'utf-8')
			readStream.push(null)
			
			readStream.pipe(res)
		  } catch (err) {
			console.error(err);
		  }
	}
}
