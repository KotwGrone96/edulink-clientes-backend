import { Router } from 'express';
import CostumerController from './controllers/CostumerController.js';
import CostumerService from './services/CostumerService.js';
import ContactInfoService from './services/ContactInfoService.js';
import TiInfoService from './services/TiInfoService.js';
import { validateToken } from './middleware/Auth.js';

//SERVICES
const costumerService = new CostumerService();
const contactInfoService = new ContactInfoService();
const tiInfoService = new TiInfoService();

//CONTROLLERS
const costumerController = new CostumerController(
	costumerService,
	contactInfoService,
	tiInfoService
);

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

export { router };
