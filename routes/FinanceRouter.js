import { financeSectionService } from "../core/services.js";
import FinanceSectionController from "../controllers/FinanceSectionController.js";
import { Router } from "express";
import { validateToken } from "../middleware/Auth.js";

const financeSectionController = new FinanceSectionController(financeSectionService)

const router = Router()

router.get('/financeSection/all',validateToken,(req,res)=>financeSectionController.findAll(req,res))

router.post('/financeSection/create',validateToken,(req,res)=>financeSectionController.create(req,res))

router.put('/financeSection/update',validateToken,(req,res)=>financeSectionController.update(req,res))

router.delete('/financeSection/delete/:id',validateToken,(req,res)=>financeSectionController.delete(req,res))

export default router
