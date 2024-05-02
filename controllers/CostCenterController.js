import fs from 'fs'
import PDFDocument from 'pdfkit'
import handlebars from 'handlebars'
import process from 'process';
import { join } from 'path';

export default class CostCenterController {

    costCenterService;
    saleService;
    userService;
    productSelledService;
    costCenterApprovalsService;

    constructor(costCenterService,saleService,userService,productSelledService,costCenterApprovalsService){
        this.costCenterService = costCenterService
        this.saleSerivce = saleService
        this.userService = userService
        this.productSelledService = productSelledService
        this.costCenterApprovalsService = costCenterApprovalsService
    }

    async validatePermission(payload){
        const sale_exist = await this.saleSerivce.findOne({
            deleted_at:null,
            id:payload['sale_id']
        },['id'])

        if(!sale_exist){
            return {
                ok:false,
                message:'La venta no existe o fue eliminado'
            }
        }

        const user_exist = await this.userService.findOne({
            deleted_at:null,
            id:payload['user_id']
        },['id'])

        if(!user_exist){
            return {
                ok:false,
                message:'El usuario no existe o fue eliminado'
            }
        }

        if(user_exist['UserRoles'][0]['Role']['name'] === 'ADMIN'){
            return{
                ok:true
            }
        }
        if(user_exist['UserRoles'][0]['Role']['name'] === 'BILLER'){
            return{
                ok:true
            }
        }

        let isManager = false;

        if(`${sale_exist['Costumer']['manager_id']}` === `${user_exist['id']}`){
            isManager = true;
        }else{
            const usersCostumersIds = sale_exist['Costumer']['UserCostumers'].map(uc=>`${uc['user_id']}`)
            isManager = usersCostumersIds.includes(`${user_exist['id']}`)
        }

        if(!isManager){
            return {
                ok:false,
                message:'No tiene permiso sobre este cliente'
            }
        }
        return{
            ok:true
        }
    }

    async create(req,res){
        if(
            'user_id' in req.body === false||
            'sale_id' in req.body === false||
            'costumer_id' in req.body === false||
            'currency' in req.body === false||
            'comission' in req.body === false||
            'products' in req.body === false
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        //TODO [***** VALIDACIÓN *****] //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //

        if(req.body['products'].length === 0){
            return res.json({
                ok:false,
                message:'Debe agregar al menos 1 producto'
            })
        }

        try {
            const costCenter = await this.costCenterService.create(req.body);

            req.body['products'].forEach(async(pd)=>{
                pd['cost_center_id'] = costCenter['id'];
                await this.productSelledService.create(pd);
            })

            return res.json({
                ok:true,
                message:'Creado correctamente',
                costCenter
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al crear el registro',
                error
            })
        }

    }

    async update(req,res){
        if(
            'id' in req.body === false||
            'user_id' in req.body === false||
            'sale_id' in req.body === false||
            'currency' in req.body === false||
            'type_of_payment' in req.body === false
        ){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        //TODO [***** VALIDACIÓN *****] //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //

        if(req.body['state'] != 'APPROVED' && req.body['state'] != 'OBSERVED'){
            if(!req.body['products'] || req.body['products'].length === 0){
                return res.json({
                    ok:false,
                    message:'Debe agregar al menos 1 producto'
                })
            }
            const productsToUpdate = req.body['products'].filter(p=> ('id' in p)===true )
            const productsToCreate= req.body['products'].filter(p=> ('id' in p)===false)
    
            productsToCreate.forEach(async(pd)=>{
                pd['cost_center_id'] = req.body['id'];
                await this.productSelledService.create(pd);
            })
    
            productsToUpdate.forEach(async(pd)=>{
                await this.productSelledService.update(pd,{deleted_at:null,id:pd.id});
            }) 
        }

        try {
            await this.costCenterService.update(req.body,{deleted_at:null,id:req.body['id']})

            if(req.body['state'] != 'DRAFT' && req.body['state'] != 'SEND' && req.body['CostCenterApproval']){
                await this.costCenterApprovalsService.updateOrCreate(req.body['CostCenterApproval'])
            }

            return res.json({
                ok:true,
                message:'Actualizado correctamente'
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al crear el registro',
                error
            })
        }

    }

    async findAll(req,res){
        const where = {deleted_at:null}
        if('user_id' in req.query){
			where['user_id'] = req.query['user_id'];
		}
        if('state' in req.query){
			where['state'] = req.query['state'];
		}
        try {
            const costsCenters = await this.costCenterService.findAll(where,[
                    'id',
                    'user_id',
                    'sale_id',
                    'costumer_id',
                    'final_costumer',
                    'purchase_order_name',
                    'costumer_contact',
                    'phone_or_email',
                    'currency',
                    'type_of_payment',
                    'date_of_send',
                    'max_date_of_costumer_attention',
                    'max_date_of_provider_attention',
                    'comission',
                    'state',
                    'created_at'
                ])
            return res.json({
                ok:true,
                message:'Todos los centros de costos',
                costsCenters
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar los centros de costos',
                error
            })
        }
    }

    async findOne(req,res){
        try {
            const costCenter = await this.costCenterService.findOne(
                {
                    deleted_at:null,
                    id:req.params['id']
                },[
                    'id',
                    'user_id',
                    'sale_id',
                    'costumer_id',
                    'final_costumer',
                    'purchase_order_name',
                    'costumer_contact',
                    'phone_or_email',
                    'currency',
                    'type_of_payment',
                    'date_of_send',
                    'max_date_of_costumer_attention',
                    'max_date_of_provider_attention',
                    'comission',
                    'state',
                    'created_at'
                ])
            return res.json({
                ok:true,
                message:'Centro de costos',
                costCenter
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar el centro de costos',
                error
            })
        }
    }

    async delete(req,res){
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }

        try {
            await this.costCenterService.delete(req.params['id']);
            return res.json({
                ok:true,
                message:'Eliminado correctamente'
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al eliminar el registro',
                error
            })
        }
    }

    async generatePDF(req,res){
        // Obtener las variables del cuerpo de la solicitud
        const { title, content } = req.body;
        const template = handlebars.compile(fs.readFileSync(join(process.cwd(),'templates','costCenterPDF.hbs'), 'utf8'));
        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('documento.pdf'));

        // Renderizar el contenido HTML con Handlebars
        const html = template({ title, content });

        // Agregar el contenido HTML al PDF
        doc.font('Helvetica').text(html);
        // Finalizar y cerrar el PDF
        doc.end();
        console.log(html)
        // Enviar el PDF como respuesta
        res.sendFile('documento.pdf',{ root: process.cwd() });
    }

}