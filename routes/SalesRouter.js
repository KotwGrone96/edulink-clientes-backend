import { Router } from "express";
import SaleService from './../services/SaleService.js'
import SaleController from './../controllers/SaleController.js'
import CostumerService from "../services/CostumerService.js";
import UserService from "../services/UserService.js";
import { validateToken } from "../middleware/Auth.js";

const saleService = new SaleService()
const costumerService = new CostumerService()
const userService = new UserService()

const saleController = new SaleController(saleService,costumerService,userService)

const router = Router()

router.get('/sales/all',validateToken,(req,res)=> saleController.findAll(req,res))
router.get('/sales/:id',validateToken,(req,res)=> saleController.findOne(req,res))
router.post('/sales/create',validateToken,(req,res)=> saleController.create(req,res))
router.put('/sales/update',validateToken,(req,res)=> saleController.update(req,res))
router.delete('/sales/delete/:id',validateToken,(req,res)=> saleController.delete(req,res))

export default router