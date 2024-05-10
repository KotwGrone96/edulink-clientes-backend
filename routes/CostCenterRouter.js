import { Router } from "express";
import CostCenterController from "../controllers/CostCenterController.js";
import { validateToken } from "../middleware/Auth.js";
import { costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService } from "../core/services.js";

const costCenterController = new CostCenterController(costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService)

const router = Router();


router.get('/costCenter/all',validateToken,(req,res)=> costCenterController.findAll(req,res))
router.get('/costCenter/:id',validateToken,(req,res)=> costCenterController.findOne(req,res))
router.post('/costCenter/create',validateToken,(req,res)=> costCenterController.create(req,res))
router.post('/costCenter/generatePDF',validateToken,(req,res)=> costCenterController.generatePDF(req,res))
router.put('/costCenter/update',validateToken,(req,res)=> costCenterController.update(req,res))
router.delete('/costCenter/delete/:id',validateToken,(req,res)=> costCenterController.delete(req,res))

export default router