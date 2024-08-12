import { invoiceService } from "../core/services.js";
import InvoiceController from "../controllers/InvoiceController.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';
import { validateToken } from "../middleware/Auth.js";
import { Router } from "express";

const invoiceController = new InvoiceController(invoiceService)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(cwd(), 'storage', 'invoices'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('invoice')

const router = Router();

router.get('/invoice/all',validateToken,(req,res)=>invoiceController.findAll(req,res))
router.get('/invoice/files/:filename',validateToken,(req,res)=>invoiceController.findInvoiceFile(req,res))
router.get('/invoice/:id',validateToken,(req,res)=>invoiceController.findOne(req,res))
router.post('/invoice/create',validateToken,(req,res)=>invoiceController.create(req,res))
router.post(
	'/invoice/uploadInvoice',
	validateToken,
	upload,
	(req,res)=>invoiceController.uploadInvoice(req,res))
router.put('/invoice/update',validateToken,(req,res)=>invoiceController.update(req,res))
router.delete('/invoice/delete/:id',validateToken,(req,res)=>invoiceController.delete(req,res))

export default router