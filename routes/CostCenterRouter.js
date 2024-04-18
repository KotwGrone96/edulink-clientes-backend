import { Router } from "express";
import CostCenterService from "../services/CostCenterService.js";
import SaleService from "../services/SaleService.js";
import UserService from "../services/UserService.js";
import CostCenterController from "../controllers/CostCenterController.js";
import { validateToken } from "../middleware/Auth.js";

const costCenterService = new CostCenterService()
const saleService = new SaleService()
const userService = new UserService()

const costCenterController = new CostCenterController(costCenterService,saleService,userService)

const router = Router();


router.get('/costCenter/all',validateToken,(req,res)=> costCenterController.findAll(req,res))
router.get('/costCenter/:id',validateToken,(req,res)=> costCenterController.findOne(req,res))
router.post('/costCenter/create',validateToken,(req,res)=> costCenterController.create(req,res))
router.put('/costCenter/update',validateToken,(req,res)=> costCenterController.update(req,res))
router.delete('/costCenter/delete/:id',validateToken,(req,res)=> costCenterController.delete(req,res))

export default router