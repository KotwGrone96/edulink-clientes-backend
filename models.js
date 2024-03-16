import { DataTypes } from 'sequelize';
import Costumer from './models/costumer.model.js';
import ContacInfo from './models/contactInfo.model.js';
import TiInfo from './models/tiInfo.model.js';

export const loadModels = (sequelize) => {
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
			domain: {
				type: DataTypes.STRING,
			},
			phone: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			province: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			company_anniversary: {
				type: DataTypes.STRING,
			},
			sales_manager: {
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
		{ sequelize, tableName: 'costumers' }
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
				allowNull: true,
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

	//TI INFO
	TiInfo.init(
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
		{ sequelize, tableName: 'costumers_TI_info' }
	);

	//*** RELACIONES DE TABLAS ***//
	Costumer.hasMany(ContacInfo, { foreignKey: { name: 'costumer_id' } });
	Costumer.hasMany(TiInfo, { foreignKey: { name: 'costumer_id' } });

	ContacInfo.belongsTo(Costumer, { foreignKey: { name: 'costumer_id' } });
	TiInfo.belongsTo(Costumer, { foreignKey: { name: 'costumer_id' } });
};
