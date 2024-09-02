import fs from 'fs'
import { join, extname } from 'path'
import { cwd } from 'process';

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
            const filepathToDelete = join(cwd(),'storage','payments',req.body.ruc, req.body.filename)
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

    async uploadPayment(req,res){
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

        const costumerPath = join(cwd(), 'storage', 'payments',`${req.body.ruc}`);

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
            currency:req.body.currency,
            ammount:req.body.ammount,
            filename: `${req.body.name}${extname(req.file['originalname'])}`,
            payment_date: req.body.payment_date,
            cost_center_id: req.body.cost_center_id,
            sale_id: req.body.sale_id,
            costumer_id: req.body.costumer_id
        }

        try {
            const payment = await this.paymentService.create(body);

            return res.json({
                ok:true,
                message:'Cargada correctamente',
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

    async findPaymentFile(req,res){
        const { filename } = req.params;
        const { ruc } = req.query;

        if(!ruc){
            return res.status(404).json({
                ok:false,
                message:'Debe enviar el RUC/DNI del cliente'
            })
        }

        const filePath = join(cwd(),'storage','payments', ruc, filename)

        if(!fs.existsSync(filePath)){
            return res.status(404).json({
                ok:false,
                message:'El archivo no existe'
            })
        }

        res.sendFile(filePath)
    }

};
