import { financeSectionService, financeService } from "../core/services.js";
import FinanceSectionController from "../controllers/FinanceSectionController.js";
import FinanceController from "../controllers/FinanceController.js";
import { Router } from "express";
import { validateToken } from "../middleware/Auth.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';

const financeSectionController = new FinanceSectionController(financeSectionService)
const financeController = new FinanceController(financeService)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'storage', 'finances'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('invoice')

const router = Router()

router.get('/financeSection/all',validateToken,(req,res)=>financeSectionController.findAll(req,res))
router.get('/finance/all',validateToken,(req,res)=>financeController.findAll(req,res))
router.get('/finance/:id',validateToken,(req,res)=>financeController.findOne(req,res))

router.post('/financeSection/create',validateToken,(req,res)=>financeSectionController.create(req,res))
router.post('/finance/create',validateToken,upload,(req,res)=>financeController.uploadFinance(req,res))

router.put('/financeSection/update',validateToken,(req,res)=>financeSectionController.update(req,res))

router.delete('/financeSection/delete/:id',validateToken,(req,res)=>financeSectionController.delete(req,res))
router.delete('/finance/delete/:id',validateToken,(req,res)=>financeController.delete(req,res))

export default router
