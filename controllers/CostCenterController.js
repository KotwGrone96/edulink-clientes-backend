import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import {join} from 'path'
import { cwd } from "process";
import fs from 'fs'
export default class CostCenterController {

    costCenterService;
    saleService;
    userService;
    productSelledService;
    costCenterApprovalsService;
    costCenterHistoryService;
    costCenterApprovalHistoryService;

    constructor(costCenterService,saleService,userService,productSelledService,costCenterApprovalsService,costCenterHistoryService,costCenterApprovalHistoryService){
        this.costCenterService = costCenterService
        this.saleSerivce = saleService
        this.userService = userService
        this.productSelledService = productSelledService
        this.costCenterApprovalsService = costCenterApprovalsService
        this.costCenterHistoryService = costCenterHistoryService
        this.costCenterApprovalHistoryService = costCenterApprovalHistoryService
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

            const costCenterHistory = {
                costumer_id:costCenter['costumer_id'],
                sale_id:costCenter['sale_id'],
                cost_center_id:costCenter['id'],
                owner_id:costCenter['user_id'],
                action_by:costCenter['user_id'],
                action:'CREATE',
                state:costCenter['state']
            }

            await this.costCenterHistoryService.create(costCenterHistory)

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

            const lastState = req.body['state'];

            if(req.body['isObserved']){
                req.body['state'] = 'OBSERVED'
            }

            await this.costCenterService.update(req.body,{deleted_at:null,id:req.body['id']})

            if(req.body['state'] != 'DRAFT' && req.body['state'] != 'SEND' && req.body['CostCenterApproval']){
                await this.costCenterApprovalsService.updateOrCreate(req.body['CostCenterApproval'])

                const costCenterApprovalHistory = {
                    costumer_id:req.body['costumer_id'],
                    sale_id:req.body['sale_id'],
                    cost_center_id:req.body['id'],
                    owner_id:req.body['user_id'],
                    approved_by:req.body['CostCenterApproval']['approved_by'],
                    state:req.body['state'],
                    commentary:req.body['CostCenterApproval']['body']
                }
                await this.costCenterApprovalHistoryService.create(costCenterApprovalHistory)
            }

            let action_by = '';
            if(lastState === 'DRAFT' || lastState === 'SEND'){
                action_by = req.body['user_id'];
            }
            if(lastState != 'DRAFT' && lastState != 'SEND' && req.body['CostCenterApproval']){
                action_by = req.body['CostCenterApproval']['approved_by']
            }

            const costCenterHistory = {
                costumer_id:req.body['costumer_id'],
                sale_id:req.body['sale_id'],
                cost_center_id:req.body['id'],
                owner_id:req.body['user_id'],
                action_by,
                action:'UPDATE',
                state:req.body['state']
            }
            await this.costCenterHistoryService.create(costCenterHistory)

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
                    'name',
                    'phone',
                    'email',
                    'destiny_person',
                    'destiny_address',
                    'commentary',
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
                    'name',
                    'phone',
                    'email',
                    'destiny_person',
                    'destiny_address',
                    'commentary',
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

        // return res.render('costCenterPDF.hbs',{
        //     title:'PDF CENTRO DE COSTOS',
        //     name:'DM1715182500777',
        //     final_client:'INSTITUTO PEDAGOGICO MARIANNE FROSTIG',
        //     purchase_order:'',
        //     contact:'',
        //     email:'',
        //     phone:'',
        //     costumer_name:'',
        //     ruc:'',
        //     currency:'',
        //     type_of_payment:'',
        //     totalWithOutTaxes:'1440.00',
        //     taxes:'259.20',
        //     total:'1699.20',
        //     layout:false
        // })

        const filepath = join(cwd(),'views','costCenterPDF.hbs')
        const html = fs.readFileSync(filepath,{encoding:'utf-8'})
        const content = Handlebars.compile(html)({
            title:'PDF CENTRO DE COSTOS',
            name:'DM1715182500777',
            final_client:'INSTITUTO PEDAGOGICO MARIANNE FROSTIG',
            purchase_order:'',
            contact:'',
            email:'',
            phone:'',
            costumer_name:'',
            ruc:'',
            currency:'',
            type_of_payment:'',
            totalWithOutTaxes:'1440.00',
            taxes:'259.20',
            total:'1699.20',
            layout:false
        })

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setContent(content)
        await page.pdf({
            path:'pruebaPDF.pdf',
            format:'A4',
            printBackground:true,
            landscape:true
        })
        await page.close()
        await browser.close()

        res.set({
            'Content-Type':'application/pdf',
            'Content-Disposition':'attachment; filename="archivo.pdf"'
        })
        const readStream = fs.createReadStream(join(cwd(),'pruebaPDF.pdf'));
        readStream.pipe(res);

        readStream.on('end',()=>{
            fs.unlink(join(cwd(),'pruebaPDF.pdf'),(err)=>{
                if(err){
                    console.log('Hubo un error')
                    console.log(err)
                    return
                }
            })
        })
    }

}