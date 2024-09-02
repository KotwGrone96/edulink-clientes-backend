import { Router } from "express";
import ContactInfoController from "../controllers/ContactInfoController.js";
import webpush from "../core/webPush.js";
import { validateToken } from "../middleware/Auth.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';
import { contactInfoService,costumerService } from "../core/services.js";

const contactInfoController = new ContactInfoController(
	contactInfoService,
	costumerService,
	webpush
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

router.get('/contactInfo/allOfCostumer/:id', validateToken, (req, res) =>
	contactInfoController.findAllOfCostumer(req, res)
);

router.get('/contactInfo/csvAllData', validateToken, (req, res) =>
	contactInfoController.csvAllData(req, res)
);

router.post('/contactInfo/create', validateToken, (req, res) =>
	contactInfoController.create(req, res)
);

router.put('/contactInfo/update', validateToken, (req, res) =>
	contactInfoController.update(req, res)
);

router.post(
	'/contactInfo/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => contactInfoController.handleCsvFile(req, res)
);

router.delete('/contactInfo/delete/:id', validateToken, (req, res) =>
	contactInfoController.delete(req, res)
);

export default router;