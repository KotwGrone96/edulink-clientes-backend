export default class CostumerController {
	costumerService;
	contactInfoService;
	tiInfoService;
	constructor(costumerService, contactInfoService, tiInfoService) {
		this.costumerService = costumerService;
		this.contactInfoService = contactInfoService;
		this.tiInfoService = tiInfoService;
	}

	async findOne(req, res) {
		const { id } = req.params;
		const costumer = await this.costumerService.findOneById(id);
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
		const costumers = await this.costumerService.findAll();
		return res.json({
			ok: true,
			message: 'Todos los clientes',
			costumers,
		});
	}

	async create(req, res) {
		if (
			'name' in req.body == false ||
			'domain' in req.body == false ||
			'phone' in req.body == false ||
			'email' in req.body == false ||
			'address' in req.body == false ||
			'province' in req.body == false ||
			'ruc' in req.body == false ||
			'sales_manager' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		if ('contactInfo' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan ingresar los datos de contacto',
			});
		}

		const { domain } = req.body;

		const alreadyExist = await this.costumerService.findOneByDomain(domain);
		if (alreadyExist) {
			return res.json({
				ok: false,
				message: 'Este dominio ya fue registrado',
			});
		}
		const new_costumer = await this.costumerService.create(req.body);
		if (!new_costumer) {
			return res.json({
				ok: false,
				message: 'Error al crear cliente nuevo',
			});
		}
		// new_costumer['ContacInfos'] = [];
		// new_costumer['TiInfos'] = [];
		let res_costumer = {
			...new_costumer.dataValues,
			ContacInfos: [],
			TiInfos: [],
		};

		const { contactInfo } = req.body;
		contactInfo['costumer_id'] = new_costumer['id'];

		const new_contactInfo = await this.contactInfoService.create(contactInfo);

		if (!new_contactInfo) {
			return res.json({
				ok: false,
				message: 'Error al agregar la información de contacto del cliente',
			});
		}
		res_costumer['ContacInfos'] = [new_contactInfo];

		if (req.body.with_ti) {
			const { tiInfo } = req.body;
			tiInfo['costumer_id'] = new_costumer['id'];
			const new_tiInfo = await this.tiInfoService.create(tiInfo);

			if (!new_tiInfo) {
				return res.json({
					ok: false,
					message: 'Error al agregar la información de TI del cliente',
				});
			}
			res_costumer['TiInfos'] = [new_tiInfo];
		}

		return res.json({
			ok: true,
			message: 'Cliente creado correctamente',
			costumer: res_costumer,
		});
	}

	async update(req, res) {
		if (
			'id' in req.body == false ||
			'name' in req.body == false ||
			'domain' in req.body == false ||
			'phone' in req.body == false ||
			'email' in req.body == false ||
			'address' in req.body == false ||
			'province' in req.body == false ||
			'ruc' in req.body == false ||
			'sales_manager' in req.body == false
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
		if ('contactInfo' in req.body) {
			const contactInfo_updated = await this.contactInfoService.update(
				req.body['contactInfo']
			);
			if (!contactInfo_updated) {
				return res.json({
					ok: false,
					message: 'Error al actualizar información de contacto',
				});
			}
		}
		if ('tiInfo' in req.body) {
			const tiInfo_updated = await this.tiInfoService.update(
				req.body['tiInfo']
			);
			if (!tiInfo_updated) {
				return res.json({
					ok: false,
					message: 'Error al actualizar información de TI',
				});
			}
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
}
