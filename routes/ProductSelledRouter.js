import { Router } from "express"
import ProductSelledController from "../controllers/ProductSelledController.js"
import { productSelledService } from "../core/services.js"
import { validateToken } from "../middleware/Auth.js"

const productSelledController = new ProductSelledController(productSelledService)

const router = Router()

router.post('/products/create',validateToken,(req,res)=>productSelledController.create(req,res))
router.put('/products/update/:id',validateToken,(req,res)=>productSelledController.update(req,res))
router.delete('/products/delete/:id',validateToken,(req,res)=>productSelledController.delete(req,res))

export default router
