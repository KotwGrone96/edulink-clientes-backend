import { loadEnvVars } from './env.js';
import { createConnectionDB } from './dbConnection.js';
import { loadModels } from './models.js';
import { createWebServer } from './server.js';

const main = async () => {
	const env = loadEnvVars();
	const port = process.env.PORT || 3000;
	try {
		const connection = await createConnectionDB(env);
		if (!connection)
			throw new Error('No se ha podido conectar a base de datos');
		await loadModels(connection);

		const webServer = createWebServer();

		webServer.listen(port,'0.0.0.0', () => {
			console.log('ENTORNO ===> ' + process.env.NODE_ENV);
			console.log('Servidor web abierto en puerto: ' + port);
		});
	} catch (error) {
		console.error('Ha ocurrido un error al iniciar la aplicación');
		console.error(error);
		process.exit(0);
	}
};

main();
