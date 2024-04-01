import { workerData } from 'worker_threads';
import { createConnectionDB } from '../dbConnection.js';
import { loadModels } from '../models.js';
import { loadEnvVars } from './../env.js';
import ContactInfoService from '../services/ContactInfoService.js';

const updateContacts = async (workerData) => {
	const { data } = workerData;
	const env = loadEnvVars();
	const connection = await createConnectionDB(env);
	if (!connection) throw new Error('No se ha podido conectar a base de datos');
	await loadModels(connection);

	const contactInfoService = new ContactInfoService();

	data.forEach(async (contact) => {
		contactInfoService.updateOrCreateContact(contact);
	});
};

updateContacts(workerData);
