import { Sequelize } from 'sequelize';

export const createConnectionDB = async (env) => {
	const sequelize = new Sequelize({
		host: env.DB_HOST,
		username: env.DB_USER,
		password: env.DB_PASS,
		database: env.DB_NAME,
		dialect: 'mysql',
		define: {
			timestamps: false,
		},
		logging: false,
	});
	try {
		await sequelize.authenticate();
		console.log('Conexión a base de datos exitosa');
		return sequelize;
	} catch (error) {
		console.error('No se ha podido conectar a base de datos');
		console.error(error);
		return null;
	}
};
