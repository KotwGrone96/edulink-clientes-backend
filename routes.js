import { Router } from 'express';
import CostumerController from './controllers/CostumerController.js';
import CostumerService from './services/CostumerService.js';
import ContactInfoService from './services/ContactInfoService.js';
import TiInfoService from './services/TiInfoService.js';
import UserController from './controllers/UserController.js';
import UserService from './services/UserService.js';
import UserRolesService from './services/UserRolesService.js';
import SellerController from './controllers/SellerController.js';
import SellerService from './services/SellerService.js';
import { validateToken } from './middleware/Auth.js';

//SERVICES
const costumerService = new CostumerService();
const contactInfoService = new ContactInfoService();
const tiInfoService = new TiInfoService();
const userService = new UserService();
const userRolesService = new UserRolesService();
const sellerService = new SellerService();

//CONTROLLERS
const costumerController = new CostumerController(
	costumerService,
	contactInfoService,
	tiInfoService
);

const userController = new UserController(userService, userRolesService);
const sellerController = new SellerController(sellerService);

const router = Router();

//*** API ***//

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
router.put('/api/costumer/update', validateToken, (req, res) =>
	costumerController.update(req, res)
);
router.delete('/api/costumer/delete/:id', validateToken, (req, res) =>
	costumerController.delete(req, res)
);

//USERS
router.get('/api/users/all', validateToken, (req, res) =>
	userController.findAll(req, res)
);
router.get('/api/users/roles/:id', validateToken, (req, res) =>
	userController.getRoles(req, res)
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

//SELLERS
router.get('/api/sellers/all', validateToken, (req, res) =>
	sellerController.findAll(req, res)
);

router.post('/api/sellers/create', validateToken, (req, res) =>
	sellerController.create(req, res)
);
router.put('/api/sellers/update', validateToken, (req, res) =>
	sellerController.update(req, res)
);
router.delete('/api/sellers/delete/:id', validateToken, (req, res) =>
	sellerController.delete(req, res)
);

export { router };
