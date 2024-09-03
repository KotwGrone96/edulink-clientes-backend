import { Router } from "express";
import { logisticTaskService } from "../core/services.js";
import LogisticTaskController from "../controllers/LogisticTaskController.js";
import { validateToken } from "../middleware/Auth.js";

const logisticTaskController = new LogisticTaskController(logisticTaskService)

const router = Router()

router.get('/logisticTask/all',validateToken,(req,res)=> logisticTaskController.findAll(req,res))
router.get('/logisticTask/countAll', validateToken, (req, res) => logisticTaskController.countAll(req, res));
router.get('/logisticTask/:id',validateToken,(req,res)=> logisticTaskController.findOne(req,res))
router.post('/logisticTask/create',validateToken,(req,res)=> logisticTaskController.create(req,res))
router.put('/logisticTask/update',validateToken,(req,res)=> logisticTaskController.update(req,res))
router.delete('/logisticTask/delete',validateToken,(req,res)=> logisticTaskController.delete(req,res))

export default router
