import fs from 'fs'

export default class FinanceController {
    
    financeService

    constructor(financeService){
        this.financeService = financeService
    }

    async findAll(req,res){
        const where = {}

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        if('finance_section_id' in req.query){
            where['finance_section_id'] = req.query['finance_section_id']
        }

        try {
            const finances = await this.financeService.findAll(where)
            return res.json({
                ok:true,
                message:'Todas las finanzas',
                finances
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

    async findOne(req,res){
        const where = {
            id:req.params['id']
        }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        if('finance_section_id' in req.query){
            where['finance_section_id'] = req.query['finance_section_id']
        }

        try {
            const finance = await this.financeService.findOne(where)
            return res.json({
                ok:true,
                message:'Finanza encontrada',
                finance
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

    async delete(req,res){
        const id = req.params['id']
        try {
            await this.financeService.delete({id})
            return res.json({
                ok:true,
                message:"Eliminado correctamente",
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

    async uploadFinance(req,res){
        if (!req.file) {
			return res.status(400).json({
				ok: false,
				message: 'No se ha proporcionado ningún archivo',
			});
		}
        
        if('name' in req.body == false){
            fs.unlinkSync(req.file['path']);
            return res.json({
            	ok:false,
            	message:'Debe proporcionar un nombre para el archivo'
            })
        }

        if('costumer_id' in req.body == false){
            fs.unlinkSync(req.file['path']);
            return res.json({
            	ok:false,
            	message:'Debe proporcionar el ID del cliente'
            })
        }

        const costumerPath = join(cwd(), 'storage', 'finances',`${req.body.costumer_id}`);

        if(!fs.existsSync(costumerPath)){
            fs.mkdirSync(costumerPath);
        }

        const newFilename = join(costumerPath,`${req.body.name}${extname(req.file['originalname'])}`);

        if(fs.existsSync(newFilename)){
            fs.unlinkSync(req.file['path']);
            return res.json({
                ok:false,
                message:'El nombre de archivo ya existe'
            })
        }

        fs.renameSync(req.file['path'],newFilename);

        const body = {
            name:req.body.name,
            costumer_id: req.body.costumer_id,
            filename: `${req.body.name}${extname(req.file['originalname'])}`,        
            finance_section_id: req.body.finance_section_id
        }

        try {
            const finance = await this.financeService.create(body);

            return res.json({
                ok:true,
                message:'Cargada correctamente',
                finance
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
