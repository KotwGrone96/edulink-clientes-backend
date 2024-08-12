import fs from 'fs'
import { join, extname } from 'path'
import { cwd } from 'process';

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

        if('cost_center_id' in req.query){
            where['cost_center_id'] = req.query['cost_center_id']
        }

        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        const attributes = [
            'id',
            'name',
            'currency',
            'ammount',
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
            'currency',
            'ammount',
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
            const filepathToDelete = join(cwd(),'storage','invoices',req.body.ruc, req.body.filename)
            fs.unlinkSync(filepathToDelete)
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
        
        if('name' in req.body == false){
            fs.unlinkSync(req.file['path']);
            return res.json({
            	ok:false,
            	message:'Debe proporcionar un nombre para el archivo'
            })
        }

        if('ruc' in req.body == false){
            fs.unlinkSync(req.file['path']);
            return res.json({
            	ok:false,
            		message:'Debe proporcionar el RUC/DNI del cliente'
            })
        }

        const costumerPath = join(cwd(), 'storage', 'invoices',`${req.body.ruc}`);

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
            currency:req.body.currency,
            ammount:req.body.ammount,
            filename: `${req.body.name}${extname(req.file['originalname'])}`,
            invoice_date: req.body.invoice_date,
            cost_center_id: req.body.cost_center_id,
            sale_id: req.body.sale_id,
            costumer_id: req.body.costumer_id
        }

        try {
            const invoice = await this.invoiceService.create(body);

            return res.json({
                ok:true,
                message:'Cargada correctamente',
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

    async findInvoiceFile(req,res){
        const { filename } = req.params;
        const { ruc } = req.query;

        if(!ruc){
            return res.status(404).json({
                ok:false,
                message:'Debe enviar el RUC/DNI del cliente'
            })
        }

        const filePath = join(cwd(),'storage','invoices', ruc, filename)

        if(!fs.existsSync(filePath)){
            return res.status(404).json({
                ok:false,
                message:'El archivo no existe'
            })
        }

        res.sendFile(filePath)
    }

};
