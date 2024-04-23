import { Router } from "express";
import SaleController from './../controllers/SaleController.js'
import { validateToken } from "../middleware/Auth.js";
import { saleService,costumerService,userService } from "../core/services.js";

const saleController = new SaleController(saleService,costumerService,userService)

const router = Router()

router.get('/sales/all',validateToken,(req,res)=> saleController.findAll(req,res))
router.get('/sales/:id',validateToken,(req,res)=> saleController.findOne(req,res))
router.post('/sales/create',validateToken,(req,res)=> saleController.create(req,res))
router.put('/sales/update',validateToken,(req,res)=> saleController.update(req,res))
router.delete('/sales/delete/:id',validateToken,(req,res)=> saleController.delete(req,res))

export default router