export default class FinanceSectionController {
    
    financeSectionService

    constructor(financeSectionService){
        this.financeSectionService = financeSectionService
    }

    async create(req,res){
        try {
            const financeSection = await this.financeSectionService.create(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                financeSection
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

    async update(req,res){

        const where = {
            id: req.body['id']
        }

        try {
            const financeSection = await this.financeSectionService.update(req.body, where)
            return res.json({
                ok:true,
                message:'Actualizado correctamente',
                financeSection
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
            await this.financeSectionService.delete({id})
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

    async findAll(req,res){
        try {
            const financeSections = await this.financeSectionService.findAll();
            return res.json({
                ok:true,
                message:'Todos los secciones',
                financeSections
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

};
