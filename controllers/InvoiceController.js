export default class InvoiceController {
    
    invoiceService;

    constructor(invoiceService){
        this.invoiceService = invoiceService; 
    }

    async create(req,res){
        if(
            'name' in req.body ||
            'filename' in req.body ||
            'invoice_date' in req.body ||
            'cost_center_id' in req.body ||
            'sale_id' in req.body ||
            'costumer_id' in req.body
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }

        try {
            const invoice = await this.invoiceService.create(req.body);
            return res.json({
                ok:true,
                message:'Creado correctamente',
                invoice
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
            'name' in req.body ||
            'filename' in req.body ||
            'invoice_date' in req.body ||
            'cost_center_id' in req.body ||
            'sale_id' in req.body ||
            'costumer_id' in req.body
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
            await this.invoiceService.update(req.body,where);
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
            'name',
            'filename',
            'invoice_date',
            'is_paid',
            'paid_date',
            'cost_center_id',
            'sale_id',
            'costumer_id',
            'created_at',
        ]

        try {
            const invoices = await this.invoiceService.findAll(where,attributes);
            return res.json({
                ok:true,
                message:'Todas las facturas',
                invoices
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
            deleted_at:null,
            id:req.params['id']
        };
        const attributes = [
            'id',
            'name',
            'filename',
            'invoice_date',
            'is_paid',
            'paid_date',
            'cost_center_id',
            'sale_id',
            'costumer_id',
            'created_at',
        ]

        try {
            const invoice = await this.invoiceService.findOne(where,attributes);
            return res.json({
                ok:true,
                message:'Factura encontrada',
                invoice
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
            await this.invoiceService.delete(req.params['id']);
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

    async uploadInvoice(req,res){
        if (!req.file) {
			return res.status(400).json({
				ok: false,
				message: 'No se ha proporcionado ningún archivo',
			});
		}
        console.log(req.file)
        return res.json({
            ok:true,
            message:'Guardado correctamente'
        })
    }
};
