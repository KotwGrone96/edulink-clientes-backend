export default class EmailController {
    emailService

    constructor(emailService){
        this.emailService = emailService;
    }

    async findAll(req,res){
        try {
            const where = {}
            const emails = await this.emailService.findAll(where);
            return res.json({
                ok:true,
                message:'Todos los correos',
                emails
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:"Ha ocurrido un error en el servidor",
                error
            })
        }
    }

    async create(req,res){
        try {
            const email = await this.emailService.create(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                email
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
            await this.emailService.delete({id})
            return res.json({
                ok:true,
                message:"Retirado correctamente",
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
