export default class PaymentController {
    
    paymentService

    constructor(paymentService){
        this.paymentService = paymentService
    }

    async create(req,res){
        if(
            'costumer_id' in req.body ||
            'sale_id' in req.body ||
            'cost_center_id' in req.body ||
            'ammount' in req.body ||
            'currency' in req.body ||
            'payment_date' in req.body
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }

        try {
            const payment = await this.paymentService.create(req.body);
            return res.json({
                ok:true,
                message:'Creado correctamente',
                payment
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
        if(
            'id' in req.body ||
            'costumer_id' in req.body ||
            'sale_id' in req.body ||
            'cost_center_id' in req.body ||
            'ammount' in req.body ||
            'currency' in req.body ||
            'payment_date' in req.body
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }

        const where = { 
            id: req.body['id'],
            deleted_at:null
        }

        try {
            await this.paymentService.update(req.body,where);
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
        const where = { deleted_at:null };
        const attributes = [
            'id',
            'costumer_id',
            'sale_id',
            'cost_center_id',
            'ammount',
            'currency',
            'payment_date',
            'filename',
            'created_at',
        ]

        try {
            const payments = await this.paymentService.findAll(where,attributes);
            return res.json({
                ok:true,
                message:'Todos los pagos',
                payments
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
        const where = { deleted_at:null };
        const attributes = [
            'id',
            'costumer_id',
            'sale_id',
            'cost_center_id',
            'ammount',
            'currency',
            'payment_date',
            'filename',
            'created_at',
        ]

        try {
            const payment = await this.paymentService.findOne(where,attributes);
            return res.json({
                ok:true,
                message:'Pago encontrado',
                payment
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
            await this.paymentService.delete(req.params['id']);
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

};
