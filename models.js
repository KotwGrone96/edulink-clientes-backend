import { DataTypes } from 'sequelize';
//import Costumer from './models/costumer.model.js';
// import ContacInfo from './models/contactInfo.model.js';
// import TiInfo from './models/tiInfo.model.js';
import User from './models/user.model.js';
import Roles from './models/roles.model.js';
import UserRoles from './models/userRoles.model.js';
// import Seller from './models/seller.model.js';
import Area from './models/area.model.js';
import UserGid from './models/userGID.model.js';
import UserArea from './models/userArea.model.js';

export const loadModels = async (sequelize) => {
	//AREA
	Area.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
			},
			state: {
				type: DataTypes.STRING(20),
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{ sequelize, tableName: 'areas' }
	);

	//USERS
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
			},
			lastname: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			dni: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: true,
			},

			address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			province: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{ sequelize, tableName: 'users' }
	);

	//ROLES
	Roles.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{ sequelize, tableName: 'roles' }
	);

	//USERS GID
	UserGid.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			gid: {
				type: DataTypes.STRING,
				unique: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				references: {
					model: User,
					key: 'id',
				},
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{ sequelize, tableName: 'users_gid' }
	);

	//USERS AREA
	UserArea.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			area_id: {
				type: DataTypes.INTEGER,
				references: {
					model: Area,
					key: 'id',
				},
			},
			user_id: {
				type: DataTypes.INTEGER,
				references: {
					model: User,
					key: 'id',
				},
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{ sequelize, tableName: 'users_areas' }
	);

	//USER ROLES
	UserRoles.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				references: {
					model: User,
					key: 'id',
				},
			},
			rol_id: {
				type: DataTypes.INTEGER,
				references: {
					model: Roles,
					key: 'id',
				},
			},
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'users_roles',
		}
	);

	// //COSTUMER
	// Costumer.init(
	// 	{
	// 		id: {
	// 			type: DataTypes.INTEGER,
	// 			primaryKey: true,
	// 			autoIncrement: true,
	// 		},
	// 		name: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		domain: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		phone: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		email: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		address: {
	// 			type: DataTypes.STRING,
	// 			allowNull: true,
	// 		},
	// 		province: {
	// 			type: DataTypes.STRING,
	// 			allowNull: true,
	// 		},
	// 		company_anniversary: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		ruc: {
	// 			type: DataTypes.STRING,
	// 			allowNull: true,
	// 		},
	// 		sales_manager: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		created_at: {
	// 			type: DataTypes.DATE,
	// 		},
	// 		updated_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 		deleted_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 	},
	// 	{ sequelize, tableName: 'costumers' }
	// );

	// //CONTACT INFO
	// ContacInfo.init(
	// 	{
	// 		id: {
	// 			type: DataTypes.INTEGER,
	// 			primaryKey: true,
	// 			autoIncrement: true,
	// 		},
	// 		name: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		lastname: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		phone: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		email: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		rol: {
	// 			type: DataTypes.STRING,
	// 			allowNull: true,
	// 		},
	// 		costumer_id: {
	// 			type: DataTypes.INTEGER,
	// 		},
	// 		created_at: {
	// 			type: DataTypes.DATE,
	// 		},
	// 		updated_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 		deleted_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 	},
	// 	{ sequelize, tableName: 'costumers_contac_info' }
	// );

	// //TI INFO
	// TiInfo.init(
	// 	{
	// 		id: {
	// 			type: DataTypes.INTEGER,
	// 			primaryKey: true,
	// 			autoIncrement: true,
	// 		},
	// 		name: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		lastname: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		phone: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		email: {
	// 			type: DataTypes.STRING,
	// 		},
	// 		costumer_id: {
	// 			type: DataTypes.INTEGER,
	// 		},
	// 		created_at: {
	// 			type: DataTypes.DATE,
	// 		},
	// 		updated_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 		deleted_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 	},
	// 	{ sequelize, tableName: 'costumers_TI_info' }
	// );

	// Seller.init(
	// 	{
	// 		id: {
	// 			type: DataTypes.INTEGER,
	// 			primaryKey: true,
	// 			autoIncrement: true,
	// 		},
	// 		name: {
	// 			type: DataTypes.STRING,
	// 			unique: true,
	// 		},
	// 		created_at: {
	// 			type: DataTypes.DATE,
	// 		},
	// 		updated_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 		deleted_at: {
	// 			type: DataTypes.DATE,
	// 			allowNull: true,
	// 		},
	// 	},
	// 	{
	// 		sequelize,
	// 		tableName: 'sellers',
	// 	}
	// );

	//*** RELACIONES DE TABLAS ***//

	Area.hasMany(UserArea, { foreignKey: 'area_id' });
	UserArea.belongsTo(Area, { foreignKey: 'area_id' });

	User.hasMany(UserArea, { foreignKey: 'user_id' });
	UserArea.belongsTo(User, { foreignKey: 'user_id' });

	User.hasMany(UserRoles, { foreignKey: 'user_id' });
	UserRoles.belongsTo(User, { foreignKey: 'user_id' });

	Roles.hasMany(UserRoles, { foreignKey: 'rol_id' });
	UserRoles.belongsTo(Roles, { foreignKey: 'rol_id' });

	User.hasOne(UserGid, { foreignKey: 'user_id' });
	UserGid.belongsTo(User, {
		foreignKey: 'user_id',
	});

	// if (process.env.NODE_ENV !== 'production') {
	// 	console.log('Sincronizando BD de desarrollo');
	// 	await sequelize.sync({ alter: true });
	// 	console.log('BD de desarrollo sincronizada');
	// }
};
