export default class SaleClosedController {
	saleClosedService;
	oportunityService;

	constructor(saleClosedService, oportunityService) {
		this.saleClosedService = saleClosedService;
		this.oportunityService = oportunityService;
	}

	async create(req, res) {
		if (
			'cost_center' in req.body == false ||
			'purchase_order' in req.body == false ||
			'invoice_name' in req.body == false ||
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false ||
			'sale_close_date' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const exist = await this.saleClosedService.findOne(
				{
					deleted_at: null,
					invoice_name: req.body['invoice_name'],
				},
				['id', 'sale_close_date']
			);

			if (exist) {
				return res.json({
					ok: false,
					message: 'El número de factura ya fue registrado',
					saleClosed: exist,
				});
			}

			const saleClosed = await this.saleClosedService.create(req.body);

			if (req.body['oportunity_id']) {
				const updt_oportunity = await this.oportunityService.updateToSaleClosed(
					{ id: req.body['oportunity_id'], sales_closed_id: saleClosed.id }
				);

				if (!updt_oportunity.ok) {
					return res.json({
						ok: false,
						message: updt_oportunity.message,
					});
				}
			}

			return res.json({
				ok: true,
				message: 'Venta cerrada correctamente',
				saleClosed,
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
			const salesClosed = await this.saleClosedService.findAll(where, [
				'id',
				'cost_center',
				'purchase_order',
				'invoice_name',
				'oportunity_id',
				'user_id',
				'costumer_id',
				'sale_close_date',
				'ammount',
				'notes',
				'currency',
			]);

			return res.json({
				ok: true,
				message: 'Todas las ventas cerradas',
				salesClosed,
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
			const saleClosed = await this.saleClosedService.findOne(
				{ deleted_at: null, id },
				[
					'id',
					'cost_center',
					'purchase_order',
					'invoice_name',
					'oportunity_id',
					'user_id',
					'costumer_id',
					'sale_close_date',
					'ammount',
					'notes',
					'currency',
				]
			);

			return res.json({
				ok: true,
				message: 'Venta cerrada encontrada',
				saleClosed,
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
			'cost_center' in req.body == false ||
			'purchase_order' in req.body == false ||
			'invoice_name' in req.body == false ||
			'user_id' in req.body == false ||
			'costumer_id' in req.body == false ||
			'sale_close_date' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		try {
			const saleClosed = await this.saleClosedService.update(req.body, {
				id: req.body['id'],
				deleted_at: null,
			});
			return res.json({
				ok: true,
				message: 'Venta cerrada actualizada',
				saleClosed,
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
			await this.saleClosedService.delete(id);
			return res.json({
				ok: true,
				message: 'Venta cerrada eliminada',
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
}
