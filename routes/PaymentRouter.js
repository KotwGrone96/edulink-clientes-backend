import { paymentService } from "../core/services.js";
import PaymentController from '../controllers/PaymentController.js';
import { validateToken } from "../middleware/Auth.js";
import { Router } from "express";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';

const paymentController = new PaymentController(paymentService);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'storage', 'payments'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('payment')

const router = Router()

router.get('/payment/all',validateToken,(req,res)=>paymentController.findAll(req,res))
router.get('/payment/files/:filename',validateToken,(req,res)=>paymentController.findPaymentFile(req,res))
router.get('/payment/:id',validateToken,(req,res)=>paymentController.findOne(req,res))
router.post('/payment/create',validateToken,(req,res)=>paymentController.create(req,res))
router.post(
	'/payment/uploadPayment',
	validateToken,
	upload,
	(req,res)=>paymentController.uploadPayment(req,res))
router.put('/payment/update',validateToken,(req,res)=>paymentController.update(req,res))
router.delete('/payment/delete/:id',validateToken,(req,res)=>paymentController.delete(req,res))

export default router