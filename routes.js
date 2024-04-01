import { Router } from 'express';
import CostumerController from './controllers/CostumerController.js';
import ContactInfoController from './controllers/ContactInfoController.js';
import CostumerService from './services/CostumerService.js';
import ContactInfoService from './services/ContactInfoService.js';
import UserController from './controllers/UserController.js';
import UserService from './services/UserService.js';
import UserRolesService from './services/UserRolesService.js';
// import SellerController from './controllers/SellerController.js';
// import SellerService from './services/SellerService.js';
import { validateToken } from './middleware/Auth.js';
import AreaController from './controllers/AreaController.js';
import AreaService from './services/AreaService.js';
import UserCostumerService from './services/UserCostumerService.js';
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';

//SERVICES
const costumerService = new CostumerService();
const contactInfoService = new ContactInfoService();
const userService = new UserService();
const userRolesService = new UserRolesService();
const areaService = new AreaService();
const userCostumerService = new UserCostumerService();

//CONTROLLERS
const costumerController = new CostumerController(
	costumerService,
	userCostumerService,
	userService
);

const userController = new UserController(
	userService,
	userRolesService,
	areaService
);
const areaController = new AreaController(areaService);

const contactInfoController = new ContactInfoController(
	contactInfoService,
	costumerService
);

const router = Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'temp', 'csv-uploads'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

//*** API ***//

//AREAS
router.get('/api/areas/all', validateToken, (req, res) =>
	areaController.findAll(req, res)
);
router.get('/api/areas/:id', validateToken, (req, res) =>
	areaController.findOne(req, res)
);
router.post('/api/areas/create', validateToken, (req, res) =>
	areaController.create(req, res)
);
router.post('/api/areas/assign', validateToken, (req, res) =>
	areaController.assign(req, res)
);
router.post(
	'/api/areas/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => areaController.handleCsvFile(req, res)
);
router.put('/api/areas/update', validateToken, (req, res) =>
	areaController.update(req, res)
);
router.put('/api/areas/updateRelation', validateToken, (req, res) =>
	areaController.updateRelation(req, res)
);
router.delete('/api/areas/delete/:id', validateToken, (req, res) =>
	areaController.delete(req, res)
);

//USERS
router.get('/api/users/all', validateToken, (req, res) =>
	userController.findAll(req, res)
);
router.get('/api/users/roles/:id', validateToken, (req, res) =>
	userController.getRoles(req, res)
);
router.post('/api/users/create', validateToken, (req, res) =>
	userController.create(req, res)
);
router.put('/api/users/update', validateToken, (req, res) =>
	userController.update(req, res)
);
router.post(
	'/api/users/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => userController.handleCsvFile(req, res)
);
router.post('/api/users/validate', validateToken, (req, res) =>
	userController.validateUser(req, res)
);
router.put('/api/users/updateRol', validateToken, (req, res) =>
	userController.updateRole(req, res)
);
router.delete('/api/users/delete/:id', validateToken, (req, res) =>
	userController.delete(req, res)
);

//COSTUMERS
router.get('/api/costumer/find/:id', validateToken, (req, res) =>
	costumerController.findOne(req, res)
);
router.get('/api/costumer/all', validateToken, (req, res) =>
	costumerController.findAll(req, res)
);
router.post('/api/costumer/create', validateToken, (req, res) =>
	costumerController.create(req, res)
);
router.post(
	'/api/costumer/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => costumerController.handleCsvFile(req, res)
);
router.post(
	'/api/costumer/assignManagerCSV',
	validateToken,
	upload.single('csvFile'),
	(req, res) => costumerController.assignManagerCSV(req, res)
);
router.put('/api/costumer/update', validateToken, (req, res) =>
	costumerController.update(req, res)
);
router.delete('/api/costumer/delete/:id', validateToken, (req, res) =>
	costumerController.delete(req, res)
);

//CONTACT INFO COSTUMERS

router.get('/api/contactInfo/allOfCostumer/:id', validateToken, (req, res) =>
	contactInfoController.findAllOfCostumer(req, res)
);

router.post('/api/contactInfo/create', validateToken, (req, res) =>
	contactInfoController.create(req, res)
);

router.post(
	'/api/contactInfo/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => contactInfoController.handleCsvFile(req, res)
);

router.delete('/api/contactInfo/delete/:id', validateToken, (req, res) =>
	contactInfoController.delete(req, res)
);

//SELLERS
// router.get('/api/sellers/all', validateToken, (req, res) =>
// 	sellerController.findAll(req, res)
// );

// router.post('/api/sellers/create', validateToken, (req, res) =>
// 	sellerController.create(req, res)
// );
// router.put('/api/sellers/update', validateToken, (req, res) =>
// 	sellerController.update(req, res)
// );
// router.delete('/api/sellers/delete/:id', validateToken, (req, res) =>
// 	sellerController.delete(req, res)
// );

export { router };
