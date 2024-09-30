export default class ProductSelledController {
    
    productSelledService

    constructor(productSelledService) {
        this.productSelledService = productSelledService
    }

    async create(req,res){
        try {
            if('cost_center_id' in req.body === false){
                return res.json({
                    ok:false,
                    message:'Flata el ID del centro de costos'
                })
            }

            const productSelled = await this.productSelledService.create(req.body)

            return res.json({
                ok:true,
                message:'Agregado correctamente',
                productSelled
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async update(req,res){
        try {
            if('cost_center_id' in req.body === false){
                return res.json({
                    ok:false,
                    message:'Flata el ID del centro de costos'
                })
            }

            await this.productSelledService.update(req.body,{id:req.params['id']})

            return res.json({
                ok:true,
                message:'Actualizado correctamente',
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async delete(req,res){
        try {

            await this.productSelledService.delete(req.params['id'])

            return res.json({
                ok:true,
                message:'Eliminado correctamente',
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createProductSelledDriveFile(req,res){
        try {
            const productSelledDriveFile = await this.productSelledService.createProductSelledDriveFile(req.body)
            return res.json({
                ok:true,
                message:'Agegado correctamente',
                productSelledDriveFile
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async findAllProductSelledDriveFile(req,res){
        const where = {}

        if('product_selled_id' in req.query){
            where['product_selled_id'] = req.query['product_selled_id']
        }

        try {
            const productSelledDriveFiles = await this.productSelledService.findAllProductSelledDriveFile(where)
            return res.json({
                ok:true,
                message:'Todos los archivos',
                productSelledDriveFiles
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateProductSelledDriveFile(req,res){
        const where = {id:req.params['id']}
        try {
            await this.productSelledService.updateProductSelledDriveFile(req.body,where)
            return res.json({
                ok:true,
                message:'Actualizado correctamente',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateCostCenterProductsFolder(req,res){
        const where = {
            id:req.params['id']
        }
        try {
            await this.productSelledService.updateCostCenterProductsFolder(req.body,where)
            return res.json({
                ok:true,
                message:'Actualizado'
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async deleteProductSelledDriveFile(req,res){
        const where = {id:req.params['id']}
        try {
            await this.productSelledService.deleteProductSelledDriveFile(where)
            return res.json({
                ok:true,
                message:'Eliminado correctamente',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

};
