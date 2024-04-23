import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateToken } from "../middleware/Auth.js";
import multer from "multer";
import { extname, join } from 'path';
import { cwd } from 'process';
import { userService,userRolesService,areaService } from "../core/services.js";

const userController = new UserController(
	userService,
	userRolesService,
	areaService
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

const router = Router()

router.get('/users/all', validateToken, (req, res) =>
	userController.findAll(req, res)
);
router.get('/users/roles/:id', validateToken, (req, res) =>
	userController.getRoles(req, res)
);
router.post('/users/create', validateToken, (req, res) =>
	userController.create(req, res)
);
router.put('/users/update', validateToken, (req, res) =>
	userController.update(req, res)
);
router.post(
	'/users/csv',
	validateToken,
	upload.single('csvFile'),
	(req, res) => userController.handleCsvFile(req, res)
);
router.post('/users/validate', validateToken, (req, res) =>
	userController.validateUser(req, res)
);
router.put('/users/updateRol', validateToken, (req, res) =>
	userController.updateRole(req, res)
);
router.delete('/users/delete/:id', validateToken, (req, res) =>
	userController.delete(req, res)
);

export default router