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
}
