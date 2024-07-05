import { Router } from "express";
import webpush from "../core/webPush.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';
import { validateToken } from "../middleware/Auth.js";
import CostumerController from "../controllers/CostumerController.js";
import { costumerService,userCostumerService,userService } from "../core/services.js";

const costumerController = new CostumerController(
	costumerService,
	userCostumerService,
	userService,
	webpush
);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'temp', 'csv-uploads'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

const router = Router();

router.get('/costumer/find/:id', validateToken, (req, res) =>
	costumerController.findOne(req, res)
);
router.get('/costumer/all', validateToken, (req, res) =>
	costumerController.findAll(req, res)
);
router.get('/costumer/countAll', validateToken, (req, res) =>
	costumerController.countAll(req, res)
);
router.get('/costumer/all/simpleInfo', validateToken, (req, res) =>
	costumerController.findAllSimpleInfo(req, res)
);
router.post('/costumer/create', validateToken, (req, res) =>
	costumerController.create(req, res)
);
router.post(
	'/costumer/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => costumerController.handleCsvFile(req, res)
);
router.post(
	'/costumer/assignManagerCSV',
	validateToken,
	upload.single('csvFile'),
	(req, res) => costumerController.assignManagerCSV(req, res)
);
router.post('/costumer/assignManagers', validateToken, (req, res) =>
	costumerController.assignManagers(req, res)
);
router.put('/costumer/update', validateToken, (req, res) =>
	costumerController.update(req, res)
);
router.delete('/costumer/delete/:id', validateToken, (req, res) =>
	costumerController.delete(req, res)
);
router.delete('/costumer/deleteManager', validateToken, (req, res) =>
	costumerController.deleteManager(req, res)
);

export default router;