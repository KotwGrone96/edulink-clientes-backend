export default class SaleCollaboratorController {
    
    saleCollaboratorService;

    constructor(saleCollaboratorService) {
        this.saleCollaboratorService = saleCollaboratorService;
    }

    async create(req,res) {
        if(
            'costumer_id' in req.body == false ||
            'sale_id' in req.body == false ||
            'user_id' in req.body == false ||
            'drive_folder_id' in req.body == false
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }

        try {
            
            const saleCollaborator = await this.saleCollaboratorService.create(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                saleCollaborator
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async delete(req,res) {
        try {

            await this.saleCollaboratorService.delete({id:req.params['id']})
            return res.json({
                ok:true,
                message:'Eliminado correctamente'
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async findAll(req,res){
        const where = {}

        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }
        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }
        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }

        let attributes = undefined
        let models = undefined

        if('attributes' in req.query){
            attributes = req.query['attributes'].split('-')
        }
        if('models' in req.query){
            models = req.query['models'].split('-')
        }
        
        try {

            const saleCollaborators = await this.saleCollaboratorService.findAll(where,attributes,models)

            return res.json({
                ok:true,
                message:'Todos los colaboradores',
                saleCollaborators
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async findOne(req,res){
        const where = {
            id:req.params['id']
        }

        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }
        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }
        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }

        let attributes = undefined
        let models = undefined

        if('attributes' in req.query){
            attributes = req.query['attributes'].split('-')
        }
        if('models' in req.query){
            models = req.query['models'].split('-')
        }
        
        try {

            const saleCollaborator = await this.saleCollaboratorService.findOne(where,attributes,models)

            return res.json({
                ok:true,
                message:'Se encontró colaborador',
                saleCollaborator
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createMultiple(req,res){
        if('collaborators' in req.body == false){
            return res.json({
                ok:false,
                message:'Se deben enviar los datos de los colaboradores'
            })
        }   
        
        try {
            const saleCollaborators = []
            const collaboratorsErrors = []

            for (const co of req.body['collaborators']) {
                try {
                    const newCollaborator = await this.saleCollaboratorService.create(co);
                    if (newCollaborator) {
                        saleCollaborators.push(newCollaborator);
                    } else {
                        collaboratorsErrors.push(co);
                    }
                } catch (error) {
                    collaboratorsErrors.push(co);
                }
            }

            return res.json({
                ok:true,
                message:'Agregados correctamente',
                saleCollaborators,
                collaboratorsErrors
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
