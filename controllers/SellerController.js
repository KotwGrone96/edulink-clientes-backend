export default class SellerController {
	sellerService;

	constructor(sellerService) {
		this.sellerService = sellerService;
	}

	async create(req, res) {
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		const seller_exist = await this.sellerService.findOneByName(req.body.name);

		if (seller_exist) {
			return res.json({
				ok: false,
				message: 'El vendedor ya existe',
			});
		}

		const seller = await this.sellerService.create(req.body);

		if (!seller) {
			return res.json({
				ok: false,
				message: 'Error al crear vendedor',
			});
		}

		return res.json({
			ok: true,
			message: 'Vendedor agregado',
			seller,
		});
	}

	async update(req, res) {
		if ('name' in req.body == false || 'id' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		const seller_updated = await this.sellerService.update(req.body);
		if (!seller_updated) {
			return res.json({
				ok: false,
				message: 'Error al actualizar vendedor',
			});
		}

		return res.json({
			ok: true,
			message: 'Vendedor actualizado',
		});
	}

	async delete(req, res) {
		const { id } = req.params;
		const del_seller = await this.sellerService.delete(id);
		if (!del_seller) {
			return res.json({
				ok: false,
				message: 'Error al eliminar vendedor',
			});
		}
		return res.json({
			ok: true,
			message: 'Vendedor eliminado',
		});
	}

	async findAll(req, res) {
		const sellers = await this.sellerService.findAll();
		return res.json({
			ok: true,
			message: 'Todos los vendedores',
			sellers,
		});
	}
}
