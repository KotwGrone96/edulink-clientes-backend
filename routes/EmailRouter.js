import EmailService from "../services/EmailService.js";
import EmailController from "../controllers/EmailController.js";
import { Router } from "express";
import { validateToken } from "../middleware/Auth.js";

const emailService = new EmailService()
const emailController = new EmailController(emailService)

const router = Router()

router.get('/emails/all',validateToken,(req,res)=>emailController.findAll(req,res))

export default router
