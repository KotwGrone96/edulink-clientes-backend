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
};
