import Seller from '../models/seller.model.js';
import { timeZoneLima } from '../timezone.js';

export default class SellerService {
	async create(seller) {
		const { name } = seller;
		const new_seller = Seller.build({
			name,
			created_at: timeZoneLima(),
		});

		try {
			const n_seller = await new_seller.save();
			return n_seller;
		} catch (error) {
			return null;
		}
	}

	async findAll() {
		const sellers = await Seller.findAll({
			where: { deleted_at: null },
			attributes: ['id', 'name', 'created_at'],
		});
		return sellers;
	}

	async findOneByName(name) {
		const seller = await Seller.findOne({
			where: { name, deleted_at: null },
			attributes: ['id', 'name', 'created_at'],
		});
		return seller;
	}

	async update(seller) {
		const { id, name } = seller;
		try {
			const edit_seller = await Seller.update(
				{
					name,
					updated_at: timeZoneLima(),
				},
				{ where: { id, deleted_at: null } }
			);
			return edit_seller;
		} catch (error) {
			return null;
		}
	}

	async delete(id) {
		const time = timeZoneLima();
		try {
			const seller_deleted = await Seller.update(
				{
					deleted_at: time,
					updated_at: time,
				},
				{ where: { id } }
			);
			return seller_deleted;
		} catch (error) {
			return null;
		}
	}
}
