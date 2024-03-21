export default class AreaController {
	areaService;
	constructor(areaService) {
		this.areaService = areaService;
	}

	async create(req, res) {
		if ('name' in req.body == false || 'state' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		try {
			const exist = await this.areaService.findOneByName(req.body.name);
			if (exist) {
				return res.json({
					ok: false,
					message: 'Este área ya existe',
				});
			}

			const area = await this.areaService.create(req.body);
			return res.json({
				ok: true,
				message: 'Área creada correctamente',
				area,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al crear el área',
				error,
			});
		}
	}

	async assign(req, res) {
		if ('area_id' in req.body == false || 'user_id' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}

		const { area_id, user_id } = req.body;

		try {
			const exist = await this.areaService.findOneRelation(user_id);
			if (exist) {
				return res.json({
					ok: false,
					message: 'Este usuario ya tiene un área asignada',
				});
			}

			await this.areaService.assign(area_id, user_id);
			return res.json({
				ok: true,
				message: 'Área asignada correctamente',
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al asignar el área',
				error,
			});
		}
	}

	async findOne(req, res) {
		const { id } = req.params;
		try {
			const area = await this.areaService.findOne(id);

			if (!area) {
				return res.json({
					ok: false,
					message: 'El área no existe o fue eliminada',
				});
			}

			return res.json({
				ok: true,
				message: 'Área encontrada',
				area,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al buscar el área',
				error,
			});
		}
	}

	async findAll(req, res) {
		try {
			const areas = await this.areaService.findAll();
			return res.json({
				ok: true,
				message: 'Todas las áreas',
				areas,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al buscar las áreas',
				error,
			});
		}
	}

	async update(req, res) {
		if (
			'name' in req.body == false ||
			'state' in req.body == false ||
			'id' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		try {
			const rows = await this.areaService.update(req.body);
			return res.json({
				ok: true,
				message: 'Área actualizada correctamente',
				rows,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al actualizar el área',
				error,
			});
		}
	}

	async updateRelation(req, res) {
		if ('area_id' in req.body == false || 'user_id' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Faltan datos por enviar',
			});
		}
		const { area_id, user_id } = req.body;

		try {
			const area = await this.areaService.findOne(area_id);

			if (!area) {
				return res.json({
					ok: false,
					message: 'El área no existe o fue eliminada',
				});
			}

			await this.areaService.updateRelation(area_id, user_id);
			return res.json({
				ok: true,
				message: 'Área actualizada correctamente',
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al actualizar el área',
				error,
			});
		}
	}

	async delete(req, res) {
		const { id } = req.params;
		try {
			const rows = await this.areaService.delete(id);

			if (rows !== 0) {
				await this.areaService.deleteRelation(id);
			}

			return res.json({
				ok: true,
				message: 'Área eliminada correctamente',
				rows,
			});
		} catch (error) {
			console.log(error);
			return res.json({
				ok: false,
				message: 'Error al eliminar el área',
				error,
			});
		}
	}
}
