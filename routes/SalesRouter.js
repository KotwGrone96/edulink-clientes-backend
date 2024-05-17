import { Router } from "express";
import SaleController from './../controllers/SaleController.js'
import { validateToken } from "../middleware/Auth.js";
import { saleService,costumerService,userService, saleHistoryService, saleTaskService } from "../core/services.js";

const saleController = new SaleController(saleService,costumerService,userService, saleHistoryService,saleTaskService)

const router = Router()

router.get('/sales/all',validateToken,(req,res)=> saleController.findAll(req,res))
router.get('/sales/:id',validateToken,(req,res)=> saleController.findOne(req,res))
router.post('/sales/create',validateToken,(req,res)=> saleController.create(req,res))
router.put('/sales/update',validateToken,(req,res)=> saleController.update(req,res))
router.delete('/sales/delete/:id',validateToken,(req,res)=> saleController.delete(req,res))

router.get('/saleTask/all',validateToken,(req,res)=> saleController.findAllSaleTask(req,res))
router.get('/saleTask/:id',validateToken,(req,res)=> saleController.findOneSaleTask(req,res))
router.post('/saleTask/create',validateToken,(req,res)=> saleController.createSaleTask(req,res))
router.put('/saleTask/update',validateToken,(req,res)=> saleController.updateSaleTask(req,res))
router.delete('/saleTask/delete/:id',validateToken,(req,res)=> saleController.deleteTask(req,res))

export default router