import { workerData } from 'worker_threads';
import { createConnectionDB } from '../dbConnection.js';
import { loadModels } from '../models.js';
import { loadEnvVars } from './../env.js';
import UserCostumerService from '../services/UserCostumerService.js';

const updateUserCostumers = async (workerData) => {
	const { data } = workerData;
	const env = loadEnvVars();
	const connection = await createConnectionDB(env);
	if (!connection) throw new Error('No se ha podido conectar a base de datos');
	await loadModels(connection);

	const userCostumerService = new UserCostumerService();

	data.forEach(async (d) => {
		const { user_id, costumer_id } = d;
		await userCostumerService.updateOrCreateUserCostumer(user_id, costumer_id);
	});
	//console.log(data);
};

updateUserCostumers(workerData);
