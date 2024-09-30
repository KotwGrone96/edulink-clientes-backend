import { Router } from "express"
import ProductSelledController from "../controllers/ProductSelledController.js"
import { productSelledService } from "../core/services.js"
import { validateToken } from "../middleware/Auth.js"

const productSelledController = new ProductSelledController(productSelledService)

const router = Router()

router.get('/products/findAllProductSelledDriveFile',validateToken,(req,res)=>productSelledController.findAllProductSelledDriveFile(req,res))

router.post('/products/create',validateToken,(req,res)=>productSelledController.create(req,res))
router.post('/products/createProductSelledDriveFile',validateToken,(req,res)=>productSelledController.createProductSelledDriveFile(req,res))

router.put('/products/update/:id',validateToken,(req,res)=>productSelledController.update(req,res))
router.put('/products/updateProductSelledDriveFile/:id',validateToken,(req,res)=>productSelledController.updateProductSelledDriveFile(req,res))
router.put('/products/updateCostCenterProductsFolder/:id',validateToken,(req,res)=>productSelledController.updateCostCenterProductsFolder(req,res))

router.delete('/products/delete/:id',validateToken,(req,res)=>productSelledController.delete(req,res))
router.delete('/products/deleteProductSelledDriveFile/:id',validateToken,(req,res)=>productSelledController.deleteProductSelledDriveFile(req,res))

export default router
