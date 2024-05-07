export default class SaleController{

    saleService
    costumerSerivce
    userService
    saleHistoryService

    constructor(saleService,costumerService,userService,saleHistoryService){
        this.saleService = saleService
        this.costumerSerivce = costumerService
        this.userService = userService
        this.saleHistoryService = saleHistoryService
    }

    async validatePermission(payload){
        const costumer_exist = await this.costumerSerivce.findOne({
            deleted_at:null,
            id:payload['costumer_id']
        },['id','manager_id'])

        if(!costumer_exist){
            return {
                ok:false,
                message:'El cliente no existe o fue eliminado'
            }
        }

        const user_exist = await this.userService.findOne({
            deleted_at:null,
            id:payload['user_id']
        },['id'])

        if(!user_exist){
            return {
                ok:false,
                message:'El usuario no existe o fue eliminado'
            }
        }

        if(user_exist['UserRoles'][0]['Role']['name'] === 'ADMIN'){
            return{
                ok:true
            }
        }

        let isManager = false;

        if(`${costumer_exist['manager_id']}` === `${user_exist['id']}`){
            isManager = true;
        }else{
            const usersCostumersIds = costumer_exist['UserCostumers'].map(uc=>`${uc['user_id']}`)
            isManager = usersCostumersIds.includes(`${user_exist['id']}`)
        }

        if(!isManager){
            return {
                ok:false,
                message:'No tiene permiso sobre este cliente'
            }
        }
        return{
            ok:true
        }
    }

    async create(req,res){
        if(
            'name' in req.body === false||
            'costumer_id' in req.body === false||
            'user_id' in req.body === false||
            'start_date' in req.body === false||
            'state' in req.body === false||
            'type' in req.body === false||
            'currency' in req.body === false
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        //TODO [***** VALIDACIÓN *****] //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //

        try {
            const sale = await this.saleService.create(req.body)
            const saleHistory = {
                costumer_id:sale['costumer_id'],
                sale_id:sale['id'],
                user_id:sale['user_id'],
                type:'CREATE',
                state:sale['state']
            }
            await this.saleHistoryService.create(saleHistory)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                sale
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al crear el registro',
                error
            })
        }

    }

    async update(req,res){
        if(
            'id' in req.body === false||
            'costumer_id' in req.body === false||
            'user_id' in req.body === false||
            'start_date' in req.body === false||
            'state' in req.body === false||
            'type' in req.body === false||
            'currency' in req.body === false
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        //TODO [***** VALIDACIÓN *****] //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //
        try {
            await this.saleService.update(req.body,{deleted_at:null,id:req.body['id']});

            const saleHistory = {
                costumer_id:req.body['costumer_id'],
                sale_id:req.body['id'],
                user_id:req.body['user_id'],
                type:'UPDATE',
                state:req.body['state']
            }
            await this.saleHistoryService.create(saleHistory)

            return res.json({
                ok:true,
                message:'Actualizado correctamente'
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al actualizar el registro',
                error
            })
        }

    }
    
    async findAll(req,res){

        const where = { deleted_at:null }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        try {
            const sales = await this.saleService.findAll(
                where,
                ['id',
                'costumer_id',
                'user_id',
                'start_date',
                'end_date',
                'state',
                'type',
                'ammount',
                'currency',
                'description',
                'notes',
                'name',
                'purchase_order',
                'folder',
                'sale_close_email',
                'created_at']
            )
            
            return res.json({
                ok:true,
                message:'Todos las ventas',
                sales
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar las ventas',
                error
            })
        }
    }

    async findOne(req,res){
        try {
            const sale = await this.saleService.findOne(
                {
                    deleted_at:null,
                    id:req.params['id']
                },
                ['id',
                'costumer_id',
                'user_id',
                'start_date',
                'end_date',
                'state',
                'type',
                'ammount',
                'currency',
                'description',
                'notes',
                'name',
                'purchase_order',
                'folder',
                'sale_close_email',
                'created_at']
            )
            
            return res.json({
                ok:true,
                message:'Venta encontrada',
                sale
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar la venta',
                error
            })
        }
    }

    async delete(req,res){
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }

        try {
            await this.saleService.delete(req.params['id']);
            return res.json({
                ok:true,
                message:'Eliminado correctamente'
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al eliminar el registro',
                error
            })
        }
    }

}