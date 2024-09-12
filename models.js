import { DataTypes } from 'sequelize';
import Costumer from './models/costumer.model.js';
import ContacInfo from './models/contactInfo.model.js';
import User from './models/user.model.js';
import Roles from './models/roles.model.js';
import UserRoles from './models/userRoles.model.js';
import Area from './models/area.model.js';
import UserGid from './models/userGID.model.js';
import UserArea from './models/userArea.model.js';
import UserCostumer from './models/userCostumer.model.js';
import Sale from './models/sale.model.js';
import CostCenter from './models/costCenter.model.js';
import ProductSelled from './models/productSelled.model.js';
import Email from './models/email.model.js';
import CostCenterApprovals from './models/costCenterApprovals.model.js';
import Route from './models/routes.model.js';
import RouteByRol from './models/routesByRole.model.js';
import CostCenterHistory from './models/costCenterHistory.mode.js';
import CostCenterApprovalsHistory from './models/costCenterApprovalsHistory.js';
import SaleHistory from './models/saleHistory.model.js';
import SaleTask from './models/saleTask.model.js';
import Invoice from './models/invoice.model.js';
import Payment from './models/payment.model.js';
import Finance from './models/finance.model.js';
import FinanceSection from './models/financeSection.model.js';
import SaleCollaborator from './models/saleCollaborator.model.js';
import LogisticTasks from './models/logisticTask.model.js';
import LogisticTaskFile from './models/logisticTaskFile.model.js';
import CostCenterTaskItem from './models/costCenterTaskItem.js';
import CostCenterTaskUserItem from './models/costCenterTaskUserItem.js';
import CostCenterTasks from './models/costCenterTasks.js';
import CostCenterProcess from './models/costCenterProcess.model.js';
import CostCenterProcessUserTask from './models/costCenterProcessUserTask.model.js';


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
			label:{
				type:DataTypes.STRING(20)
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
			},
			rol_id: {
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
			manager_id: {
				type: DataTypes.INTEGER,
			},
			state: {
				type: DataTypes.STRING(20),
			},
			type: {
				type: DataTypes.STRING(20), //*** LEAD || COSTUMER ***//
			},
			drive_folder_id:{
				type:DataTypes.STRING,
				allowNull:true
			},
			sector:{
				type:DataTypes.STRING(50)
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
			hasDriveAccess: {
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

	// VENTA
	Sale.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			name:{
				type:DataTypes.STRING(100),
				allowNull:false
			},
			costumer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING(50), //*** OPORTUNITY || SALE ***//
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
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			notes: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			purchase_order:{
				type:DataTypes.STRING,
				allowNull:true
			},
			folder:{
				type:DataTypes.STRING,
				allowNull:true
			},
			sale_close_email:{
				type:DataTypes.STRING(10),
				allowNull:true
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
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
		{ sequelize, tableName: 'sales' }
	);

	// CENTRO DE COSTOS
	CostCenter.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sale_id: {
				type: DataTypes.UUID,
				allowNull:false
			},
			costumer_id:{
				type: DataTypes.INTEGER,
				allowNull:false
			},
			name:{
				type:DataTypes.STRING(50),
				allowNull:true
			},
			final_costumer: {
				type: DataTypes.STRING,
			},
			purchase_order_name: {
				type: DataTypes.STRING,
			},
			costumer_contact: {
				type: DataTypes.STRING,
			},
			phone_or_email: {
				type: DataTypes.STRING,
			},
			phone:{
				type:DataTypes.STRING(50)
			},
			email:{
				type:DataTypes.STRING(100)
			},
			currency: {
				type: DataTypes.STRING(10),
				allowNull: false,
			},
			type_of_payment: {
				type: DataTypes.STRING,
			},
			comission:{
				type: DataTypes.STRING(10)
			},
			state:{
				type: DataTypes.STRING(50),
				allowNull:false
			},
			date_of_send: {
				type: DataTypes.DATE,
			},
			max_date_of_costumer_attention:{
				type: DataTypes.DATE
			},
			max_date_of_provider_attention:{
				type: DataTypes.DATE
			},
			destiny_person:{
				type:DataTypes.STRING(100)
			},
			destiny_address:{
				type:DataTypes.STRING(255)
			},
			commentary:{
				type:DataTypes.TEXT
			},
			email_thread_id:{
				type:DataTypes.STRING(255)
			},
			email_subject:{
				type:DataTypes.STRING(255)
			},
			ammountHidden:{
				type:DataTypes.STRING(50)
			},
			ammountWithOutTaxes:{
				type:DataTypes.STRING(50)
			},
			ammountTaxes:{
				type:DataTypes.STRING(50)
			},
			ammountTotal:{
				type:DataTypes.STRING(50)
			},
			netMargin:{
				type:DataTypes.STRING(50)
			},
			invoice_email:{
				type:DataTypes.STRING
			},
			invoice_manager:{
				type:DataTypes.STRING
			},
			biller_email:{
				type:DataTypes.STRING
			},
			biller_manager:{
				type:DataTypes.STRING
			},
			tasks:{
				type:DataTypes.STRING
			},
			payments_months:{
				type:DataTypes.STRING
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
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
		{ sequelize, tableName: 'costs_center' }
	);

	// PRODUCTOS POR VENTA
	ProductSelled.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			cost_center_id: {
				type: DataTypes.UUID,
				allowNull:false
			},
			part_number: {
				type: DataTypes.STRING(100),
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			purchase_price: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			sale_price: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING(50), //*** MAIN || EXTRA || THIRD ***//
				allowNull:false
			},
			provider:{
				type: DataTypes.STRING(100),
				allowNull:true
			},
			porcentage:{
				type: DataTypes.STRING(50),
				allowNull:true
			},
			isVisible:{
				type: DataTypes.STRING(10)
			},
			plus_to:{
				type: DataTypes.STRING,
			},
			commentary:{
				type: DataTypes.STRING,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
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
		{ sequelize, tableName: 'products_selled' }
	);

	// CORREOS AUTOMÁTICOS
	Email.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			email:{
				type:DataTypes.STRING,
				allowNull:false
			},
			subject:{
				type:DataTypes.STRING,
				allowNull:false
			},
			user_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			}
		},
		{ sequelize, tableName:'emails' }
	)

	// APROBACIONES DE CENTRO DE COSTOS
	CostCenterApprovals.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			cost_center_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			state:{
				type:DataTypes.STRING(10),
				allowNull:false
			},
			body:{
				type:DataTypes.STRING,
				allowNull:false
			},
			approved_by:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
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
		{ sequelize, tableName:'cost_center_approvals' }
	)

	// RUTAS DE APP
	Route.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			name:{
				type:DataTypes.STRING(255),
				allowNull:false
			},
			route_group:{
				type:DataTypes.STRING(50),
				allowNull:false
			},
			type:{
				type:DataTypes.STRING(50),
				allowNull:false
			}
		},
		{ sequelize, tableName:'routes' }
	)

	// RUTAS POR ROL
	RouteByRol.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			route_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			rol_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			}
		},
		{ sequelize, tableName:'routes_by_rol' }
	)

	// HISTORIAL CENTRO DE COSTOS
	CostCenterHistory.init(
		{
			id:{
				type:DataTypes.INTEGER,
				primaryKey:true,
				autoIncrement:true
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			cost_center_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			owner_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			action_by:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			action:{
				type:DataTypes.STRING(50),
				allowNull:false
			},
			state:{
				type:DataTypes.STRING(50),
				allowNull:false
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
		{ sequelize, tableName:'costs_center_history' }
	)
	
	// HISTORIAL DE APROBACIONES DE CENTRO DE COSTOS
	CostCenterApprovalsHistory.init(
		{
			id:{
				type:DataTypes.INTEGER,
				primaryKey:true,
				autoIncrement:true
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			cost_center_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			owner_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			approved_by:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			state:{
				type:DataTypes.STRING(50),
				allowNull:false
			},
			commentary:{
				type:DataTypes.STRING
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
		{ sequelize, tableName:'cost_center_approvals_history' }
	)

	// HISTORIAL DE NEGOCIOS
	SaleHistory.init(
		{
			id:{
				type:DataTypes.INTEGER,
				primaryKey:true,
				autoIncrement:true
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			user_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			type:{
				type:DataTypes.STRING(50),
				allowNull:false
			},
			state:{
				type:DataTypes.STRING(50),
				allowNull:false
			},
			attribute:{
				type:DataTypes.STRING(50)
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
			}
		},
		{ sequelize, tableName:'sales_history' }
	)

	// TAREAS POR VENTA
	SaleTask.init(
		{
			id:{
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true
			},
			name:{
				type:DataTypes.STRING,
				allowNull:false
			},
			description:{
				type:DataTypes.TEXT,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			designated_user:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			state:{
				type:DataTypes.STRING(20),
				allowNull:false
			},
			commentary:{
				type:DataTypes.TEXT
			},
			deadline:{
				type:DataTypes.DATE,
				allowNull:false
			},
			end_date:{
				type:DataTypes.DATE
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull:false
			},
			updated_at: {
				type: DataTypes.DATE
			},
			deleted_at: {
				type: DataTypes.DATE
			}
		},
		{ sequelize, tableName:'sale_tasks' }
	)

	// FACTURAS
	Invoice.init(
		{
			id:{
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			name:{
				type:DataTypes.STRING,
				unique:true,
				allowNull:false
			},
			currency:{
				type:DataTypes.STRING,
				allowNull:false
			},
			ammount:{
				type:DataTypes.STRING,
				allowNull:false
			},
			filename:{
				type:DataTypes.STRING,
				allowNull:false
			},
			invoice_date:{
				type:DataTypes.DATE,
				allowNull:false
			},
			is_paid:{
				type:DataTypes.STRING(10)
			},
			paid_date:{
				type:DataTypes.DATE
			},
			cost_center_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull:false
			},
			updated_at: {
				type: DataTypes.DATE,
			},
			deleted_at: {
				type: DataTypes.DATE,
			}
		},
		{ sequelize, tableName:'invoices' })

	// PAGOS
	Payment.init(
		{
			id:{
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			sale_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			cost_center_id:{
				type:DataTypes.UUID,
				allowNull:false
			},
			ammount:{
				type:DataTypes.STRING,
				allowNull:false
			},
			currency:{
				type:DataTypes.STRING,
				allowNull:false
			},
			payment_date:{
				type:DataTypes.STRING,
				allowNull:false
			},
			filename:{
				type:DataTypes.STRING
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull:false
			},
			updated_at: {
				type: DataTypes.DATE
			},
			deleted_at: {
				type: DataTypes.DATE
			}
		},{ sequelize, tableName:'payments' })

	FinanceSection.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		name:{
			type:DataTypes.STRING,
			allowNull:false
		},
	},{ sequelize, tableName:'finance_sections' })

	Finance.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		name:{
			type:DataTypes.STRING,
			allowNull:false
		},
		costumer_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		filename:{
			type:DataTypes.STRING,
			allowNull:false
		},
		finance_section_id:{
			type:DataTypes.UUID,
			allowNull:false
		}
	},{ sequelize, tableName:'finances' })

	SaleCollaborator.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		costumer_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		sale_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		user_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		drive_folder_id:{
			type:DataTypes.STRING,
			allowNull:false
		}

	},{ sequelize, tableName:'sales_collaborators' })

	//*** TAREAS DE LOGÍSTICA ***//
	LogisticTasks.init(
		{
			id:{
				type: DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			costumer_id:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			name:{
				type:DataTypes.STRING,
				allowNull:false
			},
			description:{
				type:DataTypes.STRING,
			},
			state:{
				type:DataTypes.STRING,
				allowNull:false
			},
			execution_date:{
				type:DataTypes.STRING,
				allowNull:false
			},
			success_date:{
				type:DataTypes.STRING
			},
			created_by:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			designated_user:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			commentary:{
				type:DataTypes.STRING,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull:false
			},
			updated_at: {
				type: DataTypes.DATE
			},
			deleted_at: {
				type: DataTypes.DATE
			}
		},{ sequelize, tableName:'logistic_tasks' }
	)

	//*** ARCHIVOS DE LOGÍSTICA ***//
	LogisticTaskFile.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		logistic_task_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		filename:{
			type:DataTypes.STRING,
			allowNull:false
		}
	},{ sequelize, tableName:'logistic_task_files' })

	//*** ITEMS DE TAREAS DE CC ***//
	CostCenterTaskItem.init({
		id:{
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement:true
		},
		name:{
			type:DataTypes.STRING,
			allowNull:false
		},
	},{ sequelize, tableName:'cost_center_tasks_items' })

	//*** USUARIOS DE TAREAS DE CC ***//
	CostCenterTaskUserItem.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		index:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		name:{
			type:DataTypes.STRING,
			allowNull:false
		},
		user_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		cost_center_task_item_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		execution_value:{
			type:DataTypes.STRING,
		},
		execution_type:{
			type:DataTypes.STRING
		}
	},{ sequelize, tableName:'cost_center_tasks_users_items' })

	//*** TAREAS DENTRO DEL CC ***//
	CostCenterTasks.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		cost_center_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		cost_center_task_item_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		}
	},{ sequelize, tableName:'cost_center_tasks' })

	//*** PROCESOS DEL CC ***//
	CostCenterProcess.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		costumer_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		sale_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		cost_center_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		cost_center_task_item_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		was_started:{
			type:DataTypes.STRING(10),
		},
		with_settings:{
			type:DataTypes.STRING(10),
		},
		index:{
			type:DataTypes.INTEGER
		},
		start_date:{
			type:DataTypes.STRING
		},
		end_date:{
			type:DataTypes.STRING
		},
		created_at:{
			type:DataTypes.DATE,
			allowNull:false
		},
		updated_at:{
			type:DataTypes.DATE,
			allowNull:false
		},
		deleted_at:{
			type:DataTypes.DATE,
		},

	},{ sequelize, tableName:'cost_center_processes' })

	CostCenterProcessUserTask.init({
		id:{
			type: DataTypes.UUID,
			defaultValue:DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
		},
		costumer_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		sale_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		cost_center_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		cost_center_process_id:{
			type:DataTypes.UUID,
			allowNull:false
		},
		index:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		name:{
			type:DataTypes.STRING,
			allowNull:false
		},
		user_id:{
			type:DataTypes.INTEGER,
			allowNull:false
		},
		start_date:{
			type:DataTypes.STRING,
			allowNull:false
		},
		deadline:{
			type:DataTypes.STRING,
			allowNull:false
		},
		end_date:{
			type:DataTypes.STRING,
		},
		state:{
			type:DataTypes.STRING(50),
			allowNull:false
		},
		commentary:{
			type:DataTypes.STRING
		},
		created_at:{
			type:DataTypes.DATE,
			allowNull:false
		},
		updated_at:{
			type:DataTypes.DATE,
			allowNull:false
		},
	},{ sequelize, tableName:'cost_center_process_users_tasks' })

	//*** RELACIONES DE TAREAS DE CC ***//
	User.hasMany(CostCenterTaskUserItem,{ foreignKey:'user_id' })
	CostCenterTaskUserItem.belongsTo(User,{ foreignKey:'user_id' })

	CostCenterTaskItem.hasMany(CostCenterTaskUserItem,{ foreignKey:'cost_center_task_item_id' })
	CostCenterTaskUserItem.belongsTo(CostCenterTaskItem,{ foreignKey:'cost_center_task_item_id' })

	CostCenter.hasMany(CostCenterTasks,{ foreignKey:'cost_center_id' })
	CostCenterTasks.belongsTo(CostCenter,{ foreignKey:'cost_center_id' })

	CostCenterTaskItem.hasMany(CostCenterTasks,{ foreignKey:'cost_center_task_item_id' })
	CostCenterTasks.belongsTo(CostCenterTaskItem,{ foreignKey:'cost_center_task_item_id' })

	//*** RELACIONES DE PROCESOS DE CC ***//
	User.hasMany(CostCenterProcessUserTask,{ foreignKey:'user_id' })
	CostCenterProcessUserTask.belongsTo(User,{ foreignKey:'user_id' })

	CostCenter.hasMany(CostCenterProcess,{ as:'CostCenterProcesses', foreignKey:'cost_center_id' })
	CostCenterProcess.belongsTo(CostCenter,{ foreignKey:'cost_center_id' })

	CostCenter.hasMany(CostCenterProcessUserTask,{ foreignKey:'cost_center_id' })
	CostCenterProcessUserTask.belongsTo(CostCenter,{ foreignKey:'cost_center_id' })

	CostCenterProcess.hasMany(CostCenterProcessUserTask,{ foreignKey:'cost_center_process_id' })
	CostCenterProcessUserTask.belongsTo(CostCenterProcess,{ foreignKey:'cost_center_process_id' })

	CostCenterTaskItem.hasMany(CostCenterProcess,{ foreignKey:'cost_center_task_item_id' })
	CostCenterProcess.belongsTo(CostCenterTaskItem,{ foreignKey:'cost_center_task_item_id' })

	Costumer.hasMany(CostCenterProcess,{ foreignKey:'costumer_id' })
	CostCenterProcess.belongsTo(Costumer,{ foreignKey:'costumer_id' })

	Sale.hasMany(CostCenterProcess,{ foreignKey:'sale_id' })
	CostCenterProcess.belongsTo(Sale,{ foreignKey:'sale_id' })


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

	//TODO *** COMERCIAL PRINCIPAL ***/
	User.hasOne(Costumer, { foreignKey: 'manager_id' });
	Costumer.belongsTo(User, { foreignKey: 'manager_id' });

	//TODO *** VENTAS POR USUARIO ***/
	User.hasMany(Sale, { foreignKey: 'user_id' });
	Sale.belongsTo(User, { foreignKey: 'user_id' });

	//TODO *** VENTAS POR CLIENTE ***/
	Costumer.hasMany(Sale, { foreignKey: 'costumer_id' });
	Sale.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	//TODO *** VENTAS POR CENTROS DE COSTOS ***/
	Costumer.hasMany(CostCenter, { foreignKey: 'costumer_id' });
	CostCenter.belongsTo(Costumer, { foreignKey: 'costumer_id' });

	//TODO *** USUARIOS POR CENTROS DE COSTOS***/
	User.hasMany(CostCenter, { foreignKey: 'user_id' });
	CostCenter.belongsTo(User, { foreignKey: 'user_id' });

	//TODO *** CENTROS DE COSTOS ***/
	Sale.hasMany(CostCenter, { foreignKey: 'sale_id' });
	CostCenter.belongsTo(Sale, { foreignKey: 'sale_id' });

	//TODO *** PRODUCTOS ***/
	CostCenter.hasMany(ProductSelled, { foreignKey: 'cost_center_id' });
	ProductSelled.belongsTo(CostCenter, { foreignKey: 'cost_center_id' });

	User.hasOne(Email, { foreignKey: 'user_id' });
	Email.belongsTo(User, { foreignKey: 'user_id' });

	CostCenter.hasOne(CostCenterApprovals, { foreignKey: 'cost_center_id' });
	CostCenterApprovals.belongsTo(CostCenter, { foreignKey: 'cost_center_id' });

	User.hasMany(CostCenterApprovals, { foreignKey: 'approved_by' });
	CostCenterApprovals.belongsTo(User, { foreignKey: 'approved_by' });

	Route.hasMany(RouteByRol, { foreignKey: 'route_id' });
	RouteByRol.belongsTo(Route, { foreignKey: 'route_id' });

	Roles.hasMany(RouteByRol, { foreignKey: 'rol_id' });
	RouteByRol.belongsTo(Roles, { foreignKey: 'rol_id' });

	//*** HISTORIAL DE CENTROS DE COSTOS ***/

	Costumer.hasMany(CostCenterHistory,{ foreignKey:'costumer_id' });
	CostCenterHistory.belongsTo(Costumer, { foreignKey:'costumer_id' });

	Sale.hasMany(CostCenterHistory, { foreignKey: 'sale_id' });
	CostCenterHistory.belongsTo(Sale, { foreignKey: 'sale_id' });

	CostCenter.hasMany(CostCenterHistory, { foreignKey: 'cost_center_id' });
	CostCenterHistory.belongsTo(CostCenter, { foreignKey: 'cost_center_id' });

	User.hasMany(CostCenterHistory, { foreignKey: 'owner_id' });
	CostCenterHistory.belongsTo(User, { foreignKey: 'owner_id' });	

	User.hasMany(CostCenterHistory, { foreignKey: 'action_by' });
	CostCenterHistory.belongsTo(User, { foreignKey: 'action_by' });	

	//*** HISTORIAL DE APROBACIONES DE CENTROS DE COSTOS ***/

	Costumer.hasMany(CostCenterApprovalsHistory,{ foreignKey:'costumer_id' });
	CostCenterApprovalsHistory.belongsTo(Costumer, { foreignKey:'costumer_id' });

	Sale.hasMany(CostCenterApprovalsHistory, { foreignKey: 'sale_id' });
	CostCenterApprovalsHistory.belongsTo(Sale, { foreignKey: 'sale_id' });

	CostCenter.hasMany(CostCenterApprovalsHistory, { foreignKey: 'cost_center_id' });
	CostCenterApprovalsHistory.belongsTo(CostCenter, { foreignKey: 'cost_center_id' });

	User.hasMany(CostCenterApprovalsHistory, { foreignKey: 'owner_id' });
	CostCenterApprovalsHistory.belongsTo(User, { foreignKey: 'owner_id' });	

	User.hasMany(CostCenterApprovalsHistory, { foreignKey: 'approved_by' });
	CostCenterApprovalsHistory.belongsTo(User, { foreignKey: 'approved_by' });	

	//*** HISTORIAL DE NEGOCIOS ***/

	Costumer.hasMany(SaleHistory,{ foreignKey:'costumer_id' });
	SaleHistory.belongsTo(Costumer, { foreignKey:'costumer_id' });

	Sale.hasMany(SaleHistory, { foreignKey: 'sale_id' });
	SaleHistory.belongsTo(Sale, { foreignKey: 'sale_id' });

	User.hasMany(SaleHistory, { foreignKey: 'user_id' });
	SaleHistory.belongsTo(User, { foreignKey: 'user_id' });	

	//*** TAREAS POR VENTAS - RELACIÓN ***/
	Sale.hasMany(SaleTask,{ foreignKey:'sale_id' });
	SaleTask.belongsTo(Sale,{ foreignKey:'sale_id' });

	User.hasMany(SaleTask,{ foreignKey:'designated_user' });
	SaleTask.belongsTo(User,{ foreignKey:'designated_user' });

	//*** FACTURACIÓN - RELACIONES ***/
	CostCenter.hasMany(Invoice,{ foreignKey:'cost_center_id' });
	Invoice.belongsTo(CostCenter,{ foreignKey:'cost_center_id' });

	Sale.hasMany(Invoice,{ foreignKey:'sale_id' });
	Invoice.belongsTo(Sale,{ foreignKey:'sale_id' });

	Costumer.hasMany(Invoice,{ foreignKey:'costumer_id' });
	Invoice.belongsTo(Costumer,{ foreignKey:'costumer_id' });

	//*** PAGOS - RELACIONES ***/
	CostCenter.hasMany(Payment,{ foreignKey:'cost_center_id' });
	Payment.belongsTo(CostCenter,{ foreignKey:'cost_center_id' });

	Sale.hasMany(Payment,{ foreignKey:'sale_id' });
	Payment.belongsTo(Sale,{ foreignKey:'sale_id' });

	Costumer.hasMany(Payment,{ foreignKey:'costumer_id' });
	Payment.belongsTo(Costumer,{ foreignKey:'costumer_id' });

	//*** FINANZAS - RELACIONES ***/
	FinanceSection.hasMany(Finance,{ foreignKey:'finance_section_id' })
	Finance.belongsTo(FinanceSection,{ foreignKey:'finance_section_id' });

	//*** COLABORADORES - RELACIONES ***/
	Costumer.hasMany(SaleCollaborator,{ foreignKey:'costumer_id' })
	SaleCollaborator.belongsTo(Costumer,{ foreignKey:'costumer_id' })

	Sale.hasMany(SaleCollaborator,{ foreignKey:'sale_id' })
	SaleCollaborator.belongsTo(Sale,{ foreignKey:'sale_id' })

	User.hasMany(SaleCollaborator,{ foreignKey:'user_id' })
	SaleCollaborator.belongsTo(User,{ foreignKey:'user_id' })

	//*** TAREAS DE LOGISTICA - RELACIONES ***/
	Costumer.hasMany(LogisticTasks,{ foreignKey:'costumer_id' })
	LogisticTasks.belongsTo(Costumer,{ foreignKey:'costumer_id' })

	User.hasMany(LogisticTasks,{ foreignKey:"designated_user" })
	LogisticTasks.belongsTo(User,{ as:"CreatedBy",foreignKey:"created_by" })
	LogisticTasks.belongsTo(User,{ as:"DesignatedUser",foreignKey:"designated_user" })

	//*** ARCHIVOS DE LOGISTICA - RELACIONES ***/
	LogisticTasks.hasMany(LogisticTaskFile,{ foreignKey:'logistic_task_id' })
	LogisticTaskFile.belongsTo(LogisticTasks,{foreignKey:'logistic_task_id'})


	// User.hasMany(LogisticTasks,{ foreignKey:{field:"designated_user",name:"DesignatedUser"} })
	// LogisticTasks.belongsTo(User,{ foreignKey:{field:"designated_user",name:"DesignatedUser"} })

	// if (process.env.NODE_ENV !== 'production') {
	// 	console.log('Sincronizando BD de desarrollo');
	// 	await sequelize.sync({ alter: true });
	// 	console.log('BD de desarrollo sincronizada');
	// }
};
