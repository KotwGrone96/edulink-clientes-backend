import fs from 'fs'
import { cwd } from 'process'
import { join } from 'path'
import sequelize, { where } from 'sequelize'
export default class LogisticTaskController {
    
    logisticTaskService

    constructor(logisticTaskService) {
        this.logisticTaskService = logisticTaskService
    }

    deleteFiles(files){
        for (const file of files){
            fs.unlinkSync(file['path']);
        }
    }

    async create(req,res){
        try {
            const logisticTask = await this.logisticTaskService.create(req.body)

            if('product_selled_id' in req.body){
                await this.logisticTaskService.createProductByLogisticTask({
                    logistic_task_id:logisticTask.dataValues.id,
                    product_selled_id:req.body['product_selled_id']
                })
            }

            if('products' in req.body){
                for (const product of req.body['products']) {
                    await this.logisticTaskService.createProductByLogisticTask({
                        logistic_task_id:logisticTask.dataValues.id,
                        product_selled_id:product
                    })
                }
                
            }

            if(req.files && req.files.length > 0){
                const costumerPath = join(cwd(), 'storage', 'tasks',`${req.body['costumer_id']}`,`${req.body['sale_id']}`,`${req.body['cost_center_id']}`);
                if(!fs.existsSync(costumerPath)){
                    fs.mkdirSync(costumerPath,{recursive:true});
                }
                for (const file of req.files) {
                    const newFilename = join(costumerPath,file['originalname']);
                    fs.renameSync(file['path'],newFilename);

                    const body = {
                        logistic_task_id:logisticTask.dataValues.id,
                        filename: file['originalname'],
                    }
                    await this.logisticTaskService.createLogisticTaskFile(body);
                }
            }

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

        if('costumer_id' in req.body === false){
            if(req.files && req.files.length > 0){
                this.deleteFiles(req.files)
            }
            return res.json({
                ok:false,
                message:'Debe enviar el ID del cliente'
            })
        }

        if('sale_id' in req.body === false){
            if(req.files && req.files.length > 0){
                this.deleteFiles(req.files)
            }
            return res.json({
                ok:false,
                message:'Debe enviar el ID del negocio'
            })
        }

        if('cost_center_id' in req.body === false){
            if(req.files && req.files.length > 0){
                this.deleteFiles(req.files)
            }
            return res.json({
                ok:false,
                message:'Debe enviar el ID del centro de costoss'
            })
        }

        const where = {id: req.params['id']}
        try {
            await this.logisticTaskService.update(req.body,where)

            if('filesToDelete' in req.body){
                if(Array.isArray(req.body['filesToDelete'])){
                    for (const fileToDelete of req.body['filesToDelete']) {
                        const costumerPath = join(cwd(), 'storage', 'tasks',`${req.body['costumer_id']}`,`${req.body['sale_id']}`,`${req.body['cost_center_id']}`,fileToDelete);
                        if(fs.existsSync(costumerPath)){
                            fs.unlinkSync(costumerPath)
                        }
                        console.log({
                            logistic_task_id:req.params['id'],
                            filename:fileToDelete
                        })
                        await this.logisticTaskService.deleteLogisticTaskFile({
                            logistic_task_id:req.params['id'],
                            filename:fileToDelete
                        })    
                    }
                }else{
                    const costumerPath = join(cwd(), 'storage', 'tasks',`${req.body['costumer_id']}`,`${req.body['sale_id']}`,`${req.body['cost_center_id']}`,req.body['filesToDelete']);
                    if(fs.existsSync(costumerPath)){
                        fs.unlinkSync(costumerPath)
                    }
                    console.log({
                        logistic_task_id:req.params['id'],
                        filename:req.body['filesToDelete']
                    })
                    await this.logisticTaskService.deleteLogisticTaskFile({
                        logistic_task_id:req.params['id'],
                        filename:req.body['filesToDelete']
                    })    
                }
            }

            if(req.files && req.files.length > 0){
                const costumerPath = join(cwd(), 'storage', 'tasks',`${req.body['costumer_id']}`,`${req.body['sale_id']}`,`${req.body['cost_center_id']}`);
                if(!fs.existsSync(costumerPath)){
                    fs.mkdirSync(costumerPath,{recursive:true});
                }
                for (const file of req.files) {
                    const newFilename = join(costumerPath,file['originalname']);
                    fs.renameSync(file['path'],newFilename);

                    const body = {
                        logistic_task_id:req.params['id'],
                        filename: file['originalname'],
                    }
                    await this.logisticTaskService.createLogisticTaskFile(body);
                }
            }

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

        if('execution_date' in req.query){
            where['execution_date'] = {
                [sequelize.Op.between] : req.query['execution_date'].split('|')
            }
        }

        if('state' in req.query){
            where['state'] = req.query['state']
        }
       
        const attributes = [
            'id',
            'costumer_id',
            'sale_id',
            'cost_center_id',
            'name',
            'description',
            'state',
            'execution_date',
            'success_date',
            'created_by',
            'designated_user',
            'commentary',
            'g_calendar_event_id',
            'g_calendar_event_link',
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
            'sale_id',
            'cost_center_id',
            'name',
            'description',
            'state',
            'execution_date',
            'success_date',
            'created_by',
            'designated_user',
            'commentary',
            'g_calendar_event_id',
            'g_calendar_event_link',
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

        if('costumer_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID del cliente'
            })
        }
        if('sale_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID de la venta'
            })
        }
        if('cost_center_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID del centro de costos'
            })
        }

        const logistic_task_id = req.params['id']
        const costumer_id = req.query['costumer_id']
        const sale_id = req.query['sale_id']
        const cost_center_id = req.query['cost_center_id']
        const where = {logistic_task_id}
        const logisticTaskFolderPath = join(cwd(),'storage','tasks',costumer_id,sale_id,cost_center_id)

        try {
            // ELIMINACIÓN DE ARCHIVOS DE LA TAREA
            const logisticTaskFiles = await this.logisticTaskService.findAllLogisticTaskFile(where,undefined)
            const logisticTaskFilesArray = logisticTaskFiles.map(ltf=>ltf.dataValues)

            for (const file of logisticTaskFilesArray) {
                const filepath = join(logisticTaskFolderPath,file['filename'])
                if(fs.existsSync(filepath)){
                    fs.unlinkSync(filepath)
                }
            }
            await this.logisticTaskService.deleteLogisticTaskFile(where)
            // **********************************
            await this.logisticTaskService.deleteProductByLogisticTask(where)
            await this.logisticTaskService.delete(logistic_task_id)
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
			where['costumer_id'] = req.query['costumer_id'];
		}
        
        if('created_by' in req.query){
            where['created_by'] = req.query['created_by']
        }

        if('designated_user' in req.query){
            where['designated_user'] = req.query['designated_user']
        }

        if('execution_date' in req.query){
            where['execution_date'] = {
                [sequelize.Op.between] : req.query['execution_date'].split('|')
            }
        }

        if('state' in req.query){
            where['state'] = req.query['state']
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

    async uploadFile(req,res){
        if (!req.files) {
			return res.status(400).json({
				ok: false,
				message: 'No se ha proporcionado ningún archivo',
			});
		}
        
        if('costumer_id' in req.body == false){
            for (const file of req.files){
                fs.unlinkSync(file['path']);
            }
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID del cliente'
            })
        }
        if('sale_id' in req.body == false){
            for (const file of req.files){
                fs.unlinkSync(file['path']);
            }
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID de la venta'
            })
        }
        if('cost_center_id' in req.body == false){
            for (const file of req.files){
                fs.unlinkSync(file['path']);
            }
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID del centro de costos'
            })
        }

        if('logistic_task_id' in req.body == false){
            for (const file of req.files){
                fs.unlinkSync(file['path']);
            }
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID de la tarea'
            })
        }

        const costumerPath = join(cwd(), 'storage', 'tasks',`${req.body['costumer_id']}`,`${req.body['sale_id']}`,`${req.body['cost_center_id']}`);

        if(!fs.existsSync(costumerPath)){
            fs.mkdirSync(costumerPath);
        }

        
        try {
            for (const file of req.files) {
                const newFilename = join(costumerPath,file['originalname']);
                fs.renameSync(file['path'],newFilename);
    
                const body = {
                    logistic_task_id:req.body['logistic_task_id'],
                    filename: file['originalname'],
                }
                await this.logisticTaskService.createLogisticTaskFile(body);
            }

            return res.json({
                ok:true,
                message:'Cargado correctamente',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async findLogisticFile(req,res){
        const { filename } = req.params;
        const { costumer_id, sale_id, cost_center_id } = req.query;

        if(!costumer_id){
            return res.status(404).json({
                ok:false,
                message:'Debe enviar el ID del cliente'
            })
        }
        if(!sale_id){
            return res.status(404).json({
                ok:false,
                message:'Debe enviar el ID de la venta'
            })
        }
        if(!cost_center_id){
            return res.status(404).json({
                ok:false,
                message:'Debe enviar el ID del centro de costos'
            })
        }

        const filePath = join(cwd(),'storage','tasks', costumer_id, sale_id, cost_center_id, filename)

        if(!fs.existsSync(filePath)){
            return res.status(404).json({
                ok:false,
                message:'El archivo no existe'
            })
        }

        res.sendFile(filePath)
    }

    async findAllProductByLogisticTask(req,res){
       const where = {}

       if('product_selled_id' in req.query){
        where['product_selled_id'] = req.query['product_selled_id']
       }
       if('logistic_task_id' in req.query){
        where['logistic_task_id'] = req.query['logistic_task_id']
       }

       try {
        const productByLogisticTasks = await this.logisticTaskService.findAllProductByLogisticTask(where)
        return res.json({
            ok:true,
            message:'Todas las tareas de productos',
            productByLogisticTasks
        })
       
       } catch (error) {
        return res.json({
            ok:false,
            message:'Error en el servidor',
            error
        })
       }

    }

    async deleteProductByLogisticTask(req,res){
        if('costumer_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID del cliente'
            })
        }
        if('sale_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID de la venta'
            })
        }
        if('cost_center_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID del centro de costos'
            })
        }
        if('logistic_task_id' in req.query === false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID de la tarea'
            })
        }
        
        let deleteCalendar = false;

        try {
            await this.logisticTaskService.deleteProductByLogisticTask({
                id:req.params['id']
            })
    
            const productByLogisticTasks = await this.logisticTaskService.findAllProductByLogisticTask({
                logistic_task_id:req.query['logistic_task_id']
            })
            const productByLogisticTasksValues = productByLogisticTasks.map(p=>p.dataValues)
            if(productByLogisticTasksValues.length === 0){
                const logistic_task_id = req.query['logistic_task_id']
                const costumer_id = req.query['costumer_id']
                const sale_id = req.query['sale_id']
                const cost_center_id = req.query['cost_center_id']
                const logisticTaskFolderPath = join(cwd(),'storage','tasks',costumer_id,sale_id,cost_center_id)
    
                const logisticTaskFiles = await this.logisticTaskService.findAllLogisticTaskFile({logistic_task_id},undefined)
                const logisticTaskFilesArray = logisticTaskFiles.map(ltf=>ltf.dataValues)
                for (const file of logisticTaskFilesArray) {
                    const filepath = join(logisticTaskFolderPath,file['filename'])
                    if(fs.existsSync(filepath)){
                        fs.unlinkSync(filepath)
                    }
                }
                await this.logisticTaskService.deleteLogisticTaskFile({logistic_task_id})
                await this.logisticTaskService.delete(logistic_task_id)
                deleteCalendar = true
            }
            return res.json({
                ok:true,
                message:'Eliminado correctamente',
                deleteCalendar
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async deleteLogisticTaskFile(req,res){
        if('costumer_id' in req.query == false){
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID del cliente'
            })
        }
        if('sale_id' in req.query == false){
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID de la venta'
            })
        }
        if('cost_center_id' in req.query == false){
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID del centro de costos'
            })
        }
        if('filename' in req.query == false){
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el nombre del archivo'
            })
        }

        const logistic_file_id = req.params['id']
        const costumer_id = req.query['costumer_id']
        const sale_id = req.query['sale_id']
        const cost_center_id = req.query['cost_center_id']
        const where = {id:logistic_file_id}
        const logisticTaskFolderPath = join(cwd(),'storage','tasks',costumer_id,sale_id,cost_center_id)
        const filepath = join(logisticTaskFolderPath,req.query['filename'])
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath)
        }

        try {
            await this.logisticTaskService.deleteLogisticTaskFile(where)
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
