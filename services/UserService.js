import { timeZoneLima } from '../timezone.js';
import User from '../models/user.model.js';

export default class UserService {
	async findOneByGID(gid) {
		const user = await User.findOne({
			where: { deleted_at: null, gid },
		});

		return user;
	}

	async findAll() {
		const users = await User.findAll({
			where: { deleted_at: null },
			attributes: [
				'id',
				'name',
				'lastname',
				'email',
				'gid',
				'domain',
				'phone',
				'dni',
				'address',
				'created_at',
			],
		});
		return users;
	}

	async create(user) {
		const { name, lastname, email, gid, domain } = user;
		const new_user = User.build({
			name,
			lastname,
			email,
			gid,
			domain,
			created_at: timeZoneLima(),
		});

		try {
			const n_user = await new_user.save();
			return n_user;
		} catch (error) {
			return null;
		}
	}
}
