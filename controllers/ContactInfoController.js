export default class ContactInfoController {
	contactInfoService;
	constructor(contactInfoService) {
		this.contactInfoService = contactInfoService;
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

		const { email } = req.body;

		const alreadyExist = await this.contactInfoService.findOneByEmail(email);
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
				message: 'Error al crear información de contacto',
			});
		}
		return res.json({
			ok: true,
			message: 'Información de contacto creada correctamente',
			costumer: new_contactInfo,
		});
	}
}
