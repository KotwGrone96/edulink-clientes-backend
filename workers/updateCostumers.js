import { workerData } from 'worker_threads';
import { createConnectionDB } from '../dbConnection.js';
import { loadModels } from '../models.js';
import { loadEnvVars } from './../env.js';
import CostumerService from '../services/CostumerService.js';

const updateCostumersWorker = async (workerData) => {
	const { to_update_list, to_create_list } = workerData;
	const env = loadEnvVars();
	const connection = await createConnectionDB(env);
	if (!connection) throw new Error('No se ha podido conectar a base de datos');
	await loadModels(connection);

	const costumerService = new CostumerService();

	//TODO [ +++++ CLIENTES +++++ ]
	if (to_create_list.length > 0) {
		await costumerService.bulkCreate(to_create_list);
	}
	if (to_update_list.length > 0) {
		to_update_list.forEach(async (u) => {
			await costumerService.updateByRuc(u);
		});
	}
	// try {

	// } catch (error) {
	// 	console.error('Ha ocurrido un error al iniciar el worker de costumers');
	// 	console.error(error);
	// 	process.exit(0);
	// }
};

updateCostumersWorker(workerData);
