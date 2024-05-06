import { Router } from "express";
import { routeService } from "../core/services.js";
import RouteController from "../controllers/RouteController.js";
import { validateToken } from "../middleware/Auth.js";

const routeController = new RouteController(routeService)

const router = Router();

router.get('/routes/all',validateToken,(req,res)=>routeController.findAll(req,res))

router.post('/routes/routeByRole/create',validateToken,(req,res)=>routeController.createRouteByRol(req,res))

router.delete('/routes/routeByRole/delete',validateToken,(req,res)=>routeController.deleteRouteByRol(req,res))


export default router