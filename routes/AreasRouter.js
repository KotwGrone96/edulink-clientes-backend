import { Router } from "express";
import AreaService from "../services/AreaService.js";
import AreaController from "../controllers/AreaController.js";
import { validateToken } from "../middleware/Auth.js";
import multer from "multer";
import { extname, join } from 'path';
import { cwd } from 'process';


const areaService = new AreaService();
const areaController = new AreaController(areaService);

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

router.get('/areas/all', validateToken, (req, res) => areaController.findAll(req, res));
router.get('/areas/:id', validateToken, (req, res) => areaController.findOne(req, res));
router.post('/areas/create', validateToken, (req, res) => areaController.create(req, res));
router.post('/areas/assign', validateToken, (req, res) => areaController.assign(req, res));
router.post('/areas/csv', validateToken, upload.single('csvFile'), (req, res) => areaController.handleCsvFile(req, res));
router.put('/areas/update', validateToken, (req, res) => areaController.update(req, res));
router.put('/areas/updateRelation', validateToken, (req, res) => areaController.updateRelation(req, res));
router.delete('/areas/delete/:id', validateToken, (req, res) => areaController.delete(req, res));

export default router