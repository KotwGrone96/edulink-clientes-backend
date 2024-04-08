import { workerData } from 'worker_threads';
import { createConnectionDB } from '../dbConnection.js';
import { loadModels } from '../models.js';
import { loadEnvVars } from './../env.js';
import CostumerService from '../services/CostumerService.js';

const updateCostumersWorker = async (workerData) => {
	const { data } = workerData;
	const env = loadEnvVars();
	const connection = await createConnectionDB(env);
	if (!connection) throw new Error('No se ha podido conectar a base de datos');
	await loadModels(connection);

	const costumerService = new CostumerService();

	data.forEach(async (costumer) => {
		await costumerService.updateOrCreate(costumer);
	});
};

updateCostumersWorker(workerData);
