export default class OportunityController {
	oportunityService;

	constructor(oportunityService) {
		this.oportunityService = oportunityService;
	}

	async create(req, res) {
		if (
			'name' in req.body == false ||
			'description' in req.body == false ||
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false ||
			'start_date' in req.body == false ||
			'state' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const oportunity = await this.oportunityService.create(req.body);
			return res.json({
				ok: true,
				message: 'Oportunidad creada',
				oportunity,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async findAll(req, res) {
		try {
			const where =
				'costumer_id' in req.params
					? { deleted_at: null, costumer_id: req.params['costumer_id'] }
					: { deleted_at: null };

			const oportunities = await this.oportunityService.findAll(where, [
				'id',
				'name',
				'description',
				'user_id',
				'costumer_id',
				'sales_closed_id',
				'start_date',
				'end_date',
				'state',
				'ammount',
				'notes',
				'currency',
			]);

			return res.json({
				ok: true,
				message: 'Todas las oportunidades',
				oportunities,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async findOne(req, res) {
		const { id } = req.params;

		try {
			const oportunity = await this.oportunityService.findOne(
				{ deleted_at: null, id },
				[
					'id',
					'name',
					'description',
					'user_id',
					'costumer_id',
					'sales_closed_id',
					'start_date',
					'end_date',
					'state',
					'ammount',
					'notes',
					'currency',
				]
			);

			return res.json({
				ok: true,
				message: 'Oportunidad encontrada',
				oportunity,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async update(req, res) {
		if (
			'id' in req.body == false ||
			'name' in req.body == false ||
			'description' in req.body == false ||
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false ||
			'start_date' in req.body == false ||
			'state' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const oportunity = await this.oportunityService.update(req.body, {
				id: req.body['id'],
				deleted_at: null,
			});
			return res.json({
				ok: true,
				message: 'Oportunidad actualizada',
				oportunity,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async delete(req, res) {
		const { id } = req.params;
		try {
			await this.oportunityService.delete(id);
			return res.json({
				ok: true,
				message: 'Oportunidad eliminada',
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async updateToSaleClosed(req, res) {
		if (
			'id' in req.body == false ||
			'name' in req.body == false ||
			'description' in req.body == false ||
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false ||
			'sales_closed_id' in req.body == false ||
			'start_date' in req.body == false ||
			'end_date' in req.body == false ||
			'state' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const oportunity = await this.oportunityService.updateToSaleClosed(
			req.body
		);

		return res.json(oportunity);
	}
}
