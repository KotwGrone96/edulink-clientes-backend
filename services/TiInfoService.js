import { timeZoneLima } from '../timezone.js';
import TiInfo from '../models/tiInfo.model.js';

export default class TiInfoService {
	async create(ti_info) {
		const { name, lastname, phone, email, costumer_id } = ti_info;

		const new_tiInfo = TiInfo.build({
			name,
			lastname,
			phone,
			email,
			costumer_id,
			created_at: timeZoneLima(),
		});

		try {
			const n_tiInfo = await new_tiInfo.save();
			return n_tiInfo;
		} catch (error) {
			return null;
		}
	}

	async update(ti_info) {
		const { id, name, lastname, phone, email } = ti_info;
		try {
			const edit_tiInfo = await TiInfo.update(
				{
					name,
					lastname,
					phone,
					email,
					updated_at: timeZoneLima(),
				},
				{ where: { id, deleted_at: null } }
			);
			return edit_tiInfo;
		} catch (error) {
			return null;
		}
	}
}
