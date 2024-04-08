import { DataTypes } from 'sequelize';
import Costumer from './models/costumer.model.js';
import ContacInfo from './models/contactInfo.model.js';
// import TiInfo from './models/tiInfo.model.js';
import User from './models/user.model.js';
import Roles from './models/roles.model.js';
import UserRoles from './models/userRoles.model.js';
// import Seller from './models/seller.model.js';
import Area from './models/area.model.js';
import UserGid from './models/userGID.model.js';
import UserArea from './models/userArea.model.js';
import UserCostumer from './models/userCostumer.model.js';
import Oportunity from './models/oportunity.model.js';
import SalesClosed from './models/salesClosed.model.js';

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

	//COSTUMER
	Costumer.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
			},
			ruc_type: {
				type: DataTypes.STRING(10),
			},
			ruc: {
				type: DataTypes.STRING,
				unique: true,
			},
			domain: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			phone: {
				type: DataTypes.STRING,
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
			company_anniversary: {
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
		{ sequelize, tableName: 'costumers' }
	);

	//USERS COSTUMERS
	UserCostumer.init(
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
			costumer_id: {
				type: DataTypes.INTEGER,
				references: {
					model: Costumer,
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
		{ sequelize, tableName: 'users_costumers' }
	);

	//CONTACT INFO
	ContacInfo.init(
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
			phone: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			rol: {
				type: DataTypes.STRING,
			},
			costumer_id: {
				type: DataTypes.INTEGER,
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
		{ sequelize, tableName: 'costumers_contac_info' }
	);

	// OPOTUNIDADES
	Oportunity.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			costumer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sales_closed_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			start_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			end_date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING(10),
				allowNull: false,
			},
			ammount: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			currency: {
				type: DataTypes.STRING(10),
				allowNull: true,
			},
			cost_center: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			notes: {
				type: DataTypes.STRING,
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
		{ sequelize, tableName: 'oportunities' }
	);

	SalesClosed.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			cost_center: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			purchase_order: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			invoice_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			oportunity_id: {
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			costumer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sale_close_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			ammount: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			currency: {
				type: DataTypes.STRING(10),
				allowNull: false,
			},
			notes: {
				type: DataTypes.STRING,
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
		{ sequelize, tableName: 'sales_closed' }
	);

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

	User.hasMany(UserCostumer, { foreignKey: 'user_id' });
	UserCostumer.belongsTo(User, { foreignKey: 'user_id' });

	Costumer.hasMany(UserCostumer, { foreignKey: 'costumer_id' });
	UserCostumer.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	Costumer.hasMany(ContacInfo, { foreignKey: 'costumer_id' });
	ContacInfo.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	User.hasMany(Oportunity, { foreignKey: 'user_id' });
	Oportunity.belongsTo(User, { foreignKey: 'user_id' });

	Costumer.hasMany(Oportunity, { foreignKey: 'costumer_id' });
	Oportunity.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	User.hasMany(SalesClosed, { foreignKey: 'user_id' });
	SalesClosed.belongsTo(User, { foreignKey: 'user_id' });

	Costumer.hasMany(SalesClosed, { foreignKey: 'costumer_id' });
	SalesClosed.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	Oportunity.hasOne(SalesClosed, { foreignKey: 'oportunity_id' });
	SalesClosed.belongsTo(Oportunity, { foreignKey: 'oportunity_id' });

	SalesClosed.hasOne(Oportunity, { foreignKey: 'sales_closed_id' });
	Oportunity.belongsTo(SalesClosed, { foreignKey: 'sales_closed_id' });

	// if (process.env.NODE_ENV !== 'production') {
	// 	console.log('Sincronizando BD de desarrollo');
	// 	await sequelize.sync({ alter: true });
	// 	console.log('BD de desarrollo sincronizada');
	// }
};
