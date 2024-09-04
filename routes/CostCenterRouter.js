import { Router } from "express";
import CostCenterController from "../controllers/CostCenterController.js";
import { validateToken } from "../middleware/Auth.js";
import { costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService } from "../core/services.js";

const costCenterController = new CostCenterController(costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService)

const router = Router();


router.get('/costCenter/all',validateToken,(req,res)=> costCenterController.findAll(req,res))
router.get('/costCenter/countAll',validateToken,(req,res)=> costCenterController.countAll(req,res))
router.get('/costCenter/findAllTaskItem',validateToken,(req,res)=> costCenterController.findAllTaskItem(req,res))
router.get('/costCenter/:id',validateToken,(req,res)=> costCenterController.findOne(req,res))
router.get('/costCenter/csv/data',validateToken,(req,res)=> costCenterController.csvAllData(req,res))
router.post('/costCenter/create',validateToken,(req,res)=> costCenterController.create(req,res))
router.post('/costCenter/createTaskItem',validateToken,(req,res)=> costCenterController.createTaskItem(req,res))
router.post('/costCenter/createTaskUserItem',validateToken,(req,res)=> costCenterController.createTaskUserItem(req,res))
router.post('/costCenter/generatePDF',validateToken,(req,res)=> costCenterController.generatePDF(req,res))
router.put('/costCenter/update',validateToken,(req,res)=> costCenterController.update(req,res))
router.put('/costCenter/updateTaskItem',validateToken,(req,res)=> costCenterController.updateTaskItem(req,res))
router.put('/costCenter/update/GmailThread',validateToken,(req,res)=> costCenterController.updateSimpleAttribute(req,res))
router.put('/costCenter/update/adminUpdate',validateToken,(req,res)=> costCenterController.adminUpdate(req,res))
router.delete('/costCenter/delete/:id',validateToken,(req,res)=> costCenterController.delete(req,res))
router.delete('/costCenter/deleteTaskItem/:id',validateToken,(req,res)=> costCenterController.deleteTaskItem(req,res))
router.delete('/costCenter/deleteTaskUserItem/:id',validateToken,(req,res)=> costCenterController.deleteTaskUserItem(req,res))

export default router