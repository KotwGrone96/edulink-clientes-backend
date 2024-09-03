export default class LogisticTaskController {
    
    logisticTaskService

    constructor(logisticTaskService) {
        this.logisticTaskService = logisticTaskService
    }

    async create(req,res){
        try {
            const logisticTask = await this.logisticTaskService.create(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                logisticTask
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
        const where = {id: req.body['id']}
        try {
            await this.logisticTaskService.update(req.body,where)
            return res.json({
                ok:true,
                message:'Actualizado correctamente'
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

        const where = { deleted_at:null }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        if('created_by' in req.query){
            where['created_by'] = req.query['created_by']
        }

        if('designated_user' in req.query){
            where['designated_user'] = req.query['designated_user']
        }

        const attributes = [
            'id',
            'costumer_id',
            'description',
            'name',
            'state',
            'execution_date',
            'success_date',
            'created_by',
            'designated_user',
            'commentary',
            'created_at',
            'updated_at'
        ]

        let limit = undefined;
        let offset = undefined;

        if('limit' in req.query){   
            limit = Number(req.query['limit'])
        }

        if('offset' in req.query){   
            offset = Number(req.query['offset'])
        }

        try {
            const logisticTasks = await this.logisticTaskService.findAll(where,attributes,limit,offset)
            return res.json({
                ok:true,
                message:'Todas las tareas de logística',
                logisticTasks
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
            id:req.params['id'], 
            deleted_at:null 
        }

        const attributes = [
            'id',
            'costumer_id',
            'description',
            'name',
            'state',
            'execute_date',
            'success_date',
            'created_by',
            'designated_user',
            'commentary',
            'created_at',
            'updated_at'
        ]

        try {
            const logisticTask = await this.logisticTaskService.findOne(where,attributes)
            return res.json({
                ok:true,
                message:'Tarea de logística encontrada',
                logisticTask
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
            await this.logisticTaskService.delete(req.params['id'])
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

    async countAll(req, res) {
		const where = { deleted_at:null }
		if('costumer_id' in req.query){
			where['id'] = req.query['costumer_id'];
		}
        
        if('created_by' in req.query){
            where['created_by'] = req.query['created_by']
        }

        if('designated_user' in req.query){
            where['designated_user'] = req.query['designated_user']
        }

		try {
            const totalItems = await this.logisticTaskService.countAll(where)
            return res.json({
                ok:true,
                message:'Todos las tareas',
                totalItems
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar las tareas',
                error
            })
        }
	}

};
