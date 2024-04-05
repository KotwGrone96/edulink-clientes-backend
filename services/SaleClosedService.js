import SalesClosed from '../models/salesClosed.model.js';
import { timeZoneLima } from '../timezone.js';
import User from '../models/user.model.js';
import Costumer from '../models/costumer.model.js';
import Oportunity from '../models/oportunity.model.js';

export default class SaleClosedService {
	async create(saleClosed) {
		const {
			cost_center,
			purchase_order,
			invoice_name,
			oportunity_id,
			user_id,
			costumer_id,
			sale_close_date,
			ammount,
			notes,
			currency,
		} = saleClosed;

		const new_sale_closed = SalesClosed.build({
			cost_center,
			purchase_order,
			invoice_name,
			oportunity_id,
			user_id,
			costumer_id,
			sale_close_date,
			ammount,
			notes,
			currency,
			created_at: timeZoneLima(),
		});

		const n_sale_closed = await new_sale_closed.save();

		return n_sale_closed;
	}

	async findOne(where, attributes) {
		const saleClosed = await SalesClosed.findOne({
			where,
			attributes,
			include: [{ model: User }, { model: Costumer }, { model: Oportunity }],
		});

		return saleClosed;
	}

	async findAll(where, attributes) {
		const salesClosed = await SalesClosed.findAll({
			where,
			attributes,
			include: [{ model: User }, { model: Costumer }, { model: Oportunity }],
		});

		return salesClosed;
	}

	async update(saleClosed, where) {
		const {
			cost_center,
			purchase_order,
			invoice_name,
			oportunity_id,
			user_id,
			costumer_id,
			sale_close_date,
			ammount,
			notes,
			currency,
		} = saleClosed;

		const updt_saleClosed = await SalesClosed.update(
			{
				cost_center,
				purchase_order,
				invoice_name,
				oportunity_id,
				user_id,
				costumer_id,
				sale_close_date,
				ammount,
				notes,
				currency,
				updated_at: timeZoneLima(),
			},
			{ where }
		);

		return updt_saleClosed;
	}

	async delete(id) {
		const del_sales_closed = await SalesClosed.update(
			{ deleted_at: timeZoneLima(), updated_at: timeZoneLima() },
			{ where: { id } }
		);
		return del_sales_closed;
	}
}
