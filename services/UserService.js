import { timeZoneLima } from '../timezone.js';
import User from '../models/user.model.js';
import UserRoles from '../models/userRoles.model.js';
import Roles from '../models/roles.model.js';
import UserGid from '../models/userGID.model.js';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import UserArea from '../models/userArea.model.js';
import Area from '../models/area.model.js';
export default class UserService {
	async findOneByGID(gid) {
		const user = await UserGid.findOne({
			where: { deleted_at: null, gid },
		});

		return user;
	}

	async findOneByEmail(email) {
		try {
			const user = await User.findOne({
				where: { deleted_at: null, email },
				include: [
					{
						model: UserRoles,
						attributes: ['id', 'user_id', 'rol_id'],
						include: [
							{
								model: Roles,
								attributes: ['name'],
							},
						],
					},
				],
			});

			return user;
		} catch (error) {
			return null;
		}
	}

	async findOneByDNI(dni) {
		const user = await User.findOne({
			where: { deleted_at: null, dni },
			attributes: ['id', 'dni', 'state'],
		});
		return user;
	}

	async findAll(where, attributes) {
		const users = await User.findAll({
			where,
			attributes,
			include: [
				{
					model: UserRoles,
					attributes: ['id', 'user_id', 'rol_id'],
					include: [
						{
							model: Roles,
							attributes: ['name'],
						},
					],
				},
				{
					model: UserArea,
					include: [{ model: Area }],
				},
			],
		});
		return users;
	}

	async findAllByEmail_WS(email, attributes) {
		const users = await User.findAll({
			where: { deleted_at: null, email },
			attributes,
		});
		return users;
	}

	async create(user) {
		const {
			name,
			lastname,
			email,
			phone,
			address,
			province,
			country,
			dni,
			state,
		} = user;
		const new_user = User.build({
			name,
			lastname,
			email,
			dni: dni ? dni : null,
			phone: phone ? phone : null,
			address: address ? address : null,
			province: province ? province : null,
			country: country ? country : null,
			state: state ? state : 'ACTIVE',
			created_at: timeZoneLima(),
		});

		try {
			const n_user = await new_user.save();
			return n_user;
		} catch (error) {
			return null;
		}
	}

	async update(user) {
		const {
			id,
			name,
			lastname,
			email,
			phone,
			address,
			province,
			country,
			dni,
			state,
		} = user;
		const updated_user = await User.update(
			{
				name,
				lastname,
				email,
				dni: dni ? dni : null,
				phone: phone ? phone : null,
				address: address ? address : null,
				province: province ? province : null,
				country: country ? country : null,
				state: state ? state : 'ACTIVE',
				updated_at: timeZoneLima(),
			},
			{ where: { id } }
		);
		return updated_user;
	}

	async updateByEmail(user) {
		const {
			name,
			lastname,
			email,
			phone,
			address,
			province,
			country,
			dni,
			state,
		} = user;
		const updated_user = await User.update(
			{
				name,
				lastname,
				dni: dni ? dni : null,
				phone: phone ? phone : null,
				address: address ? address : null,
				province: province ? province : null,
				country: country ? country : null,
				state: state ? state : 'ACTIVE',
				updated_at: timeZoneLima(),
			},
			{ where: { email } }
		);
		return updated_user;
	}

	async updateGID(userGID) {
		const { gid, user_id } = userGID;
		const user_GID = UserGid.build({
			gid,
			user_id,
			created_at: timeZoneLima(),
		});

		try {
			const n_user_gid = await user_GID.save();
			return n_user_gid;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async delete(id) {
		const time = timeZoneLima();
		try {
			const user_deleted = await User.update(
				{
					deleted_at: time,
					updated_at: time,
				},
				{ where: { id } }
			);
			return user_deleted;
		} catch (error) {
			return null;
		}
	}

	convertCSVinObject(buffer_file) {
		return new Promise((resolve, reject) => {
			const result = [];
			createReadStream(buffer_file, 'utf8')
				.pipe(csv())
				.on('data', (chuck) => {
					result.push(chuck);
				})
				.on('end', () => {
					return resolve(result);
				})
				.on('error', () => {
					return reject(null);
				});
		});
	}

	async bulkCreate(data) {
		const time = timeZoneLima();

		data.forEach((c) => {
			c['created_at'] = time;
		});
		const users = await User.bulkCreate(data);
		return users;
	}
}
