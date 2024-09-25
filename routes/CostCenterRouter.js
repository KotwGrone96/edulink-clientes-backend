import { Router } from "express";
import CostCenterController from "../controllers/CostCenterController.js";
import { validateToken } from "../middleware/Auth.js";
import { costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService } from "../core/services.js";

const costCenterController = new CostCenterController(costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalsHistoryService)

const router = Router();

router.get('/costCenter/addIndex',validateToken,(req,res)=> costCenterController.addIndex(req,res))
router.get('/costCenter/updateProductPlusTo',validateToken,(req,res)=> costCenterController.updateProductPlusTo(req,res))


router.get('/costCenter/all',validateToken,(req,res)=> costCenterController.findAll(req,res))
router.get('/costCenter/countAll',validateToken,(req,res)=> costCenterController.countAll(req,res))
router.get('/costCenter/findAllTaskItem',validateToken,(req,res)=> costCenterController.findAllTaskItem(req,res))
router.get('/costCenter/findAllCostCenterProcess',validateToken,(req,res)=> costCenterController.findAllCostCenterProcess(req,res))
router.get('/costCenter/findAllCostCenterProcessUserTask',validateToken,(req,res)=> costCenterController.findAllCostCenterProcessUserTask(req,res))
router.get('/costCenter/countAllCostCenterProcessUserTask',validateToken,(req,res)=> costCenterController.countAllCostCenterProcessUserTask(req,res))
router.get('/costCenter/:id',validateToken,(req,res)=> costCenterController.findOne(req,res))
router.get('/costCenter/csv/data',validateToken,(req,res)=> costCenterController.csvAllData(req,res))
router.post('/costCenter/create',validateToken,(req,res)=> costCenterController.create(req,res))
router.post('/costCenter/createTaskItem',validateToken,(req,res)=> costCenterController.createTaskItem(req,res))
router.post('/costCenter/createTaskUserItem',validateToken,(req,res)=> costCenterController.createTaskUserItem(req,res))
router.post('/costCenter/createMultipleTaskUserItem',validateToken,(req,res)=> costCenterController.createMultipleTaskUserItem(req,res))
router.post('/costCenter/createMultipleCostCenterProcessUserTask',validateToken,(req,res)=> costCenterController.createMultipleCostCenterProcessUserTask(req,res))
router.post('/costCenter/generatePDF',validateToken,(req,res)=> costCenterController.generatePDF(req,res))
router.put('/costCenter/update',validateToken,(req,res)=> costCenterController.update(req,res))
router.put('/costCenter/updateTaskItem',validateToken,(req,res)=> costCenterController.updateTaskItem(req,res))
router.put('/costCenter/updateTaskUserItem',validateToken,(req,res)=> costCenterController.updateTaskUserItem(req,res))
router.put('/costCenter/update/GmailThread',validateToken,(req,res)=> costCenterController.updateSimpleAttribute(req,res))
router.put('/costCenter/update/adminUpdate',validateToken,(req,res)=> costCenterController.adminUpdate(req,res))
router.put('/costCenter/updateMultipleCostCenterProcessUserTask',validateToken,(req,res)=> costCenterController.updateMultipleCostCenterProcessUserTask(req,res))
router.put('/costCenter/updateCostCenterProcess/:id',validateToken,(req,res)=> costCenterController.updateCostCenterProcess(req,res))
router.put('/costCenter/updateCostCenterProcessUserTask/:id',validateToken,(req,res)=> costCenterController.updateCostCenterProcessUserTask(req,res))
router.delete('/costCenter/delete/:id',validateToken,(req,res)=> costCenterController.delete(req,res))
router.delete('/costCenter/deleteTaskItem/:id',validateToken,(req,res)=> costCenterController.deleteTaskItem(req,res))
router.delete('/costCenter/deleteTaskUserItem/:id',validateToken,(req,res)=> costCenterController.deleteTaskUserItem(req,res))

export default router