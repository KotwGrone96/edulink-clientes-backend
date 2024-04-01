import { workerData } from 'worker_threads';
import { createConnectionDB } from '../dbConnection.js';
import { loadModels } from '../models.js';
import { loadEnvVars } from './../env.js';
import UserService from '../services/UserService.js';
import UserRolesService from '../services/UserRolesService.js';
import AreaService from '../services/AreaService.js';

const updateUsersWorker = async (workerData) => {
	const { to_update_list, to_create_list, all_roles, all_areas } = workerData;
	const env = loadEnvVars();

	try {
		const connection = await createConnectionDB(env);
		if (!connection)
			throw new Error('No se ha podido conectar a base de datos');
		await loadModels(connection);

		const userService = new UserService();
		const userRolesService = new UserRolesService();
		const areaService = new AreaService();

		let created_users = [];
		let updated_users = [];

		const updated_email_users = to_update_list.map((u) => u.email);

		//TODO [ +++++ USUARIOS +++++ ]
		if (to_create_list.length > 0) {
			created_users = await userService.bulkCreate(to_create_list);
		}
		if (to_update_list.length > 0) {
			to_update_list.forEach(async (u) => {
				await userService.updateByEmail(u);
			});
			updated_users = await userService.findAllByEmail_WS(updated_email_users, [
				'id',
				'email',
			]);
		}

		const all_users = [...to_create_list, ...to_update_list];
		const all_users_BD = [...created_users, ...updated_users];

		//TODO [ +++++ ROLES & ÁREAS+++++ ]
		if (all_users.length > 0) {
			all_users.forEach(async (ul) => {
				const user = all_users_BD.find((us) => us.email === ul.email);
				const rol = all_roles.find((cr) => cr.name === ul.rol);
				const area = all_areas.find((ca) => ca.name === ul.area);

				const user_id = user.id;
				const rol_id = rol.id;
				const area_id = area.id;
				await userRolesService.updateOrCreateUserRol(user_id, rol_id);
				await areaService.updateOrCreateUserArea(area_id, user_id);
			});
		}
	} catch (error) {
		console.error('Ha ocurrido un error al iniciar el worker de usuarios');
		console.error(error);
		process.exit(0);
	}
};

updateUsersWorker(workerData);
