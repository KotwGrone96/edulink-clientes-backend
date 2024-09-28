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

};
