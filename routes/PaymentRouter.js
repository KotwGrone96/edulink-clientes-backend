import { paymentService } from "../core/services.js";
import PaymentController from '../controllers/PaymentController.js';
import { validateToken } from "../middleware/Auth.js";
import { Router } from "express";

const paymentController = new PaymentController(paymentService);

const router = Router()

router.get('/payment/all',validateToken,(req,res)=>paymentController.findAll(req,res))
router.get('/payment/:id',validateToken,(req,res)=>paymentController.findOne(req,res))
router.post('/payment/create',validateToken,(req,res)=>paymentController.create(req,res))
router.put('/payment/update',validateToken,(req,res)=>paymentController.update(req,res))
router.delete('/payment/delete',validateToken,(req,res)=>paymentController.delete(req,res))

export default router