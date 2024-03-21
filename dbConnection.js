import { Sequelize } from 'sequelize';

const devConfig = {
	host: '127.0.0.1',
	username: 'root',
	password: '',
	database: 'nelsonga_edulink',
	dialect: 'mysql',
	define: {
		timestamps: false,
	},
	logging: false,
};

export const createConnectionDB = async (env) => {
	const sequelize = new Sequelize(
		process.env.NODE_ENV === 'production'
			? {
					host: env.DB_HOST,
					username: env.DB_USER,
					password: env.DB_PASS,
					database: env.DB_NAME,
					dialect: 'mysql',
					define: {
						timestamps: false,
					},
					logging: false,
				}
			: devConfig
	);
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
