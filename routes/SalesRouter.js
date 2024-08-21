import { Router } from "express";
import SaleController from './../controllers/SaleController.js'
import { validateToken } from "../middleware/Auth.js";
import { saleService,costumerService,userService, saleHistoryService, saleTaskService, costCenterService, saleCollaboratorService } from "../core/services.js";
import SaleCollaboratorController from "../controllers/SaleCollaboratorController.js";

const saleController = new SaleController(saleService, costumerService, userService, saleHistoryService, saleTaskService, costCenterService)
const saleCollaboratorController = new SaleCollaboratorController(saleCollaboratorService)

const router = Router()

router.get('/sales/all',validateToken,(req,res)=> saleController.findAll(req,res))
router.get('/sales/findAllAttributes',validateToken,(req,res)=> saleController.findAllAttributes(req,res))
router.get('/sales/:id',validateToken,(req,res)=> saleController.findOne(req,res))
router.get('/sales/csv/data',validateToken,(req,res)=>saleController.csvAllData(req,res))
router.post('/sales/create',validateToken,(req,res)=> saleController.create(req,res))
router.put('/sales/update',validateToken,(req,res)=> saleController.update(req,res))
router.delete('/sales/delete/:id',validateToken,(req,res)=> saleController.delete(req,res))

router.get('/saleTask/all',validateToken,(req,res)=> saleController.findAllSaleTask(req,res))
router.get('/saleTask/:id',validateToken,(req,res)=> saleController.findOneSaleTask(req,res))
router.post('/saleTask/create',validateToken,(req,res)=> saleController.createSaleTask(req,res))
router.put('/saleTask/update',validateToken,(req,res)=> saleController.updateSaleTask(req,res))
router.delete('/saleTask/delete/:id',validateToken,(req,res)=> saleController.deleteTask(req,res))

router.get('/saleCollaborator/all',validateToken,(req,res)=> saleCollaboratorController.findAll(req,res))
router.post('/saleCollaborator/create',validateToken,(req,res)=> saleCollaboratorController.create(req,res))
router.delete('/saleCollaborator/delete/:id',validateToken,(req,res)=> saleCollaboratorController.delete(req,res))

export default router