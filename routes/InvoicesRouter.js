import { invoiceService } from "../core/services.js";
import InvoiceController from "../controllers/InvoiceController.js";
import multer from 'multer';
import { extname, join } from 'path';
import { cwd } from 'process';
import { validateToken } from "../middleware/Auth.js";
import { Router } from "express";
import fs from 'fs'

const invoiceController = new InvoiceController(invoiceService)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folderPath = join(cwd(), 'storage', 'invoices', req.body.ruc);
		cb(null, folderPath);
	},
	filename: (req, file, cb) => {
		const name = req.body.name;
		cb(null, name + extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('invoice')

const router = Router();

const uploadFileMiddleware = (req,res,next) => {
	if('name' in req.body == false){
		console.log(req.body)
		return res.json({
			ok:false,
			message:'Debe proporcionar un nombre para el archivo'
		})
	}

	if('ruc' in req.body == false){
		return res.json({
			ok:false,
			message:'Debe proporcionar el RUC/DNI del cliente'
		})
	}

	const costumerPath = join(cwd(), 'storage', 'invoices',`${req.body.ruc}`);

	if(!fs.existsSync(costumerPath)){
		fs.mkdirSync(costumerPath);
	}
	const files = fs.readdirSync(costumerPath);
	let alreadyExist = false;

	for (const file of files) {
		if(file.includes(req.body.name)){
			alreadyExist = true;
			break;
		}
	}

	if(alreadyExist){
		return res.json({
			ok:false,
			message:'El nombre del archivo ya existe'
		})
	}
	upload(req,res,next);
}

router.get('/invoice/all',validateToken,(req,res)=>invoiceController.findAll(req,res))
router.get('/invoice/:id',validateToken,(req,res)=>invoiceController.findOne(req,res))
router.post('/invoice/create',validateToken,(req,res)=>invoiceController.create(req,res))
router.post(
	'/invoice/uploadInvoice',
	validateToken,
	uploadFileMiddleware,
	(req,res)=>invoiceController.uploadInvoice(req,res))
router.put('/invoice/update',validateToken,(req,res)=>invoiceController.update(req,res))
router.delete('/invoice/delete',validateToken,(req,res)=>invoiceController.delete(req,res))

export default router