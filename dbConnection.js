import { Sequelize } from 'sequelize';

// const devConfig = {
// 	host: env.DB_HOST,
// 	username: env.DB_USER,
// 	password: env.DB_PASS,
// 	database: env.DB_NAME,
// 	dialect: 'mysql',
// 	define: {
// 		timestamps: false,
// 	},
// 	logging: false,
// };

export const createConnectionDB = async (env) => {
	const sequelize = new Sequelize({
		host: env.DB_HOST,
		username: env.DB_USER,
		password: env.DB_PASS,
		port:env.DB_PORT,
		database:
			process.env.NODE_ENV === 'production' ? env.DB_NAME : env.DB_NAME_DEV,
		dialect: 'mysql',
		define: {
			timestamps: false,
		},
		logging: false,
		timezone: '-05:00',
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
