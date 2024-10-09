import { Router } from "express";
import { logisticTaskService } from "../core/services.js";
import LogisticTaskController from "../controllers/LogisticTaskController.js";
import { validateToken } from "../middleware/Auth.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';

const logisticTaskController = new LogisticTaskController(logisticTaskService)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'storage', 'tasks'));
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage: storage }).array('logisticTaskFiles')

const router = Router()

router.get('/logisticTask/all',validateToken,(req,res)=> logisticTaskController.findAll(req,res))
router.get('/logisticTask/countAll', validateToken, (req, res) => logisticTaskController.countAll(req, res));
router.get('/logisticTask/files/:filename',validateToken,(req,res)=>logisticTaskController.findLogisticFile(req,res))
router.get('/logisticTask/:id',validateToken,(req,res)=> logisticTaskController.findOne(req,res))
router.post('/logisticTask/create',validateToken,upload,(req,res)=> logisticTaskController.create(req,res))
router.post('/logisticTask/uploadFile',validateToken,upload,(req,res)=>logisticTaskController.uploadFile(req,res))
router.put('/logisticTask/update',validateToken,(req,res)=> logisticTaskController.update(req,res))
router.delete('/logisticTask/delete/:id',validateToken,(req,res)=> logisticTaskController.delete(req,res))

export default router
