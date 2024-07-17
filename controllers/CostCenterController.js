// import puppeteer from "puppeteer";
// import Handlebars from "handlebars";
// import {join} from 'path'
// import { cwd } from "process";
// import fs from 'fs'
import moment from "moment";
import { Parser } from '@json2csv/plainjs/index.js';
import {Readable} from 'stream'
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

            if('productsToDelete' in req.body){
                const { productsToDelete } = req.body;

                productsToDelete.forEach(async(ptd_id)=>{
                    await this.productSelledService.delete(ptd_id);
                })
            }
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

        const attributes = [
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
            'email_thread_id',
            'email_subject',
            'created_at',
            'ammountHidden',
            'ammountWithOutTaxes',
            'ammountTaxes',
            'ammountTotal',
            'netMargin',
            'invoice_email',
            'invoice_manager',
            'biller_email',
            'biller_manager',
            'tasks'
        ]

        let limit = undefined;
        let offset = undefined;

        if('limit' in req.query){   
            limit = Number(req.query['limit'])
        }

        if('offset' in req.query){   
            offset = Number(req.query['offset'])
        }

        try {
            const costsCenters = await this.costCenterService.findAll(where,attributes,limit,offset)
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

    async countAll(req,res){
        const where = {deleted_at:null}
        if('user_id' in req.query){
			where['user_id'] = req.query['user_id'];
		}
        if('state' in req.query){
			where['state'] = req.query['state'];
		}
        try {
            const totalItems = await this.costCenterService.countAll(where)
            return res.json({
                ok:true,
                message:'Todos los centros de costos',
                totalItems
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
                    'email_thread_id',
                    'email_subject',
                    'created_at',
                    'ammountHidden',
                    'ammountWithOutTaxes',
                    'ammountTaxes',
                    'ammountTotal',
                    'netMargin',
                    'invoice_email',
                    'invoice_manager',
                    'biller_email',
                    'biller_manager',
                    'tasks'
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
        // const hasAccess = await this.validatePermission(req.body);
        // if(!hasAccess.ok){
        //     return res.json(hasAccess)
        // }

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
        const data = {
			name: req.body['name']?req.body['name']:'',
			final_costumer: req.body['final_costumer']?req.body['final_costumer']:'',
			purchase_order: req.body['purchase_order']?req.body['purchase_order']:'',
			phone: req.body['phone']?req.body['phone']:'',
			email: req.body['email']?req.body['email']:'',
			destiny_address: req.body['destiny_address']?req.body['destiny_address']:'',
			costumerName: req.body['costumerName']?req.body['costumerName']:'',
			ruc: req.body['ruc']?req.body['ruc']:'',
			currency: req.body['currency']?req.body['currency']:'',
			type_of_payment: req.body['type_of_payment']?req.body['type_of_payment']:'',
			destiny_person: req.body['destiny_person']?req.body['destiny_person']:'',
			commentary: req.body['commentary']?req.body['commentary']:'',
			ammountWithOutTaxes: req.body['ammountWithOutTaxes']?req.body['ammountWithOutTaxes']:'',
			ammountTaxes: req.body['ammountTaxes']?req.body['ammountTaxes']:'',
			total:req.body['total']?req.body['total']:'',
            products:req.body['products']?req.body['products']:[],
            hideCostCenter:req.body['hideCostCenter'],
            invoice_email:req.body['invoice_email'],
            invoice_manager:req.body['invoice_manager'],
            biller_email:req.body['biller_email'],
            biller_manager:req.body['biller_manager'],
            layout:false
		};

        try {
            res.render('costCenterPDF',data)
            // const templateFilePath = join(cwd(),'views','costCenterPDF.hbs')
            // const pdfFilePath = join(cwd(),'temp','pdf',`${data.name}.pdf`)
            // const html = fs.readFileSync(templateFilePath,{encoding:'utf-8'})
            // const content = Handlebars.compile(html)(data)
            // return res.json({
            //     ok:true,
            //     message:'PDF GENERADO',
            //     pdf:content
            // })

            // const browser = await puppeteer.launch()
            // const page = await browser.newPage()
            // await page.setContent(content)
            // await page.pdf({
            //     path:pdfFilePath,
            //     format:'A4',
            //     printBackground:true,
            //     landscape:true
            // })
            // await page.close()
            // await browser.close()

            // res.set({
            //     'Content-Type':'application/pdf',
            //     'Content-Disposition':`attachment; filename="${data.name}.pdf"`
            // })
            // const readStream = fs.createReadStream(pdfFilePath);
            
            // readStream.pipe(res);
            // readStream.on('end',()=>{
            //     fs.unlink(pdfFilePath,(err)=>{
            //         if(err){
            //             console.log('Hubo un error')
            //             console.log(err)
            //             return
            //         }
            //     })
            // })
            // readStream.on('error',(err)=>{
            //     console.log(err)
            // })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al generar el PDF',
                error
            })
        }   
    }

    async updateSimpleAttribute(req,res){
        if(
            'id' in req.body === false ||
            'user_id' in req.body === false||
            'sale_id' in req.body === false
        )
            {
                res.json({
                    ok:false,
                    message:'Falta datos por enviar'
                })
            }
        //TODO ********************************* //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //
        try {
            await this.costCenterService.update(req.body,{deleted_at:null,id:req.body['id']})
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

    async adminUpdate(req,res){
        if(
            'id' in req.body === false ||
            'user_id' in req.body === false||
            'sale_id' in req.body === false
        )
            {
                res.json({
                    ok:false,
                    message:'Falta datos por enviar'
                })
            }
        //TODO ********************************* //
        const hasAccess = await this.validatePermission(req.body);
        if(!hasAccess.ok){
            return res.json(hasAccess)
        }
        //TODO ********************************* //
        try {
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

            if('productsToDelete' in req.body){
                const { productsToDelete } = req.body;

                productsToDelete.forEach(async(ptd_id)=>{
                    await this.productSelledService.delete(ptd_id);
                })
            }
            
            const {user_id,owner_id,...body} = req.body
            await this.costCenterService.update(body,{deleted_at:null,id:req.body['id']})

            const costCenterHistory = {
                costumer_id:req.body['costumer_id'],
                sale_id:req.body['sale_id'],
                cost_center_id:req.body['id'],
                owner_id:owner_id,
                action_by:user_id,
                action:'ADMIN_UPDATE',
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
                message:'Error en el servidor',
                error
            })
        }
    }

    async csvAllData(req,res){
        const where = {deleted_at:null}
        if('user_id' in req.query){
			where['user_id'] = req.query['user_id'];
		}

        if('costumer_id' in req.query){
			where['user_id'] = req.query['user_id'];
		}
        
        if('state' in req.query){
			where['state'] = req.query['state'];
		}

        const attributes = [
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
            'email_thread_id',
            'email_subject',
            'created_at',
            'ammountHidden',
            'ammountWithOutTaxes',
            'ammountTaxes',
            'ammountTotal',
            'netMargin',
            'invoice_email',
            'invoice_manager',
            'biller_email',
            'biller_manager',
            'tasks'
        ]
        const costsCenters = await this.costCenterService.findAll(where,attributes)
        const arrayCCs = costsCenters.map(cc=>cc.dataValues)

        const stateTranslates = {
            DRAFT:'Borrador',
            SEND:'En aprobación',
            APPROVED:'Aprobado',
            OBSERVED:'Observado'
        }

        const filterData = arrayCCs.map(cc=>{

            let tasks = cc.tasks && cc.tasks.length > 0
                ?JSON.parse(cc.tasks).join('|')
                .replace('LICENSES_ACTIVATION_GOOGLE','Activación de licencias Google')
                .replace('LICENSES_ACTIVATION','Activación de otras licencias')
                .replace('PURCHASE','Compra de productos')
                .replace('TI_HARDWARE_INSTALLATION','Instalación de hardware')
                .replace('TI_SOFTWARE_INSTALLATION','Instalación de software')
                :''

            const costCenter = {
                'ID de CC':cc.id,
                'Nombre de CC':cc.name,
                'ID de cliente':cc.costumer_id,
                'Cliente':cc.Costumer.name,
                'Nombre comercial':cc.final_costumer,
                'Tipo de documento':cc.Costumer.ruc_type,
                'Documento':cc.Costumer.ruc,
                'ID de negocio':cc.sale_id,
                'Negocio':cc.Sale.name,
                'Teléfono':cc.phone,
                'Correo':cc.email,
                'Dirección de entrega':cc.destiny_address,
                'Persona que recibe':cc.destiny_person,
                'Correo de facturación':cc.invoice_email,
                'Responsable de facturación':cc.invoice_manager,
                'Correo de cobranza':cc.biller_email,
                'Responsable de cobranza':cc.biller_manager,
                'Comentarios':cc.commentary,
                'Tareas':tasks,
                'ID de creador':cc.user_id,
                'Creador':`${cc.User.name} ${cc.User.lastname}`,
                'Fecha de creación':moment(cc.created_at).format('YYYY-MM-DD HH:mm'),
                'Estado':stateTranslates[cc.state],
                'Fecha de envío para aprobación':cc.state != 'DRAFT'?moment(cc.date_of_send).format('YYYY-MM-DD HH:mm'):'',
                'Fecha de última revisión':cc.CostCenterApproval?moment(cc.CostCenterApproval.updated_at).format('YYYY-MM-DD HH:mm'):'',
                'Revisado por':cc.CostCenterApproval?`${cc.CostCenterApproval.User.name} ${cc.CostCenterApproval.User.lastname}`:'',
                'Moneda':cc.currency,
                'Forma de pago':cc.type_of_payment,
                'Total de venta':cc.ammountTotal,
                'Total sin IGV':cc.ammountWithOutTaxes,
                'IGV':cc.ammountTaxes,
                'Costo oculto del proyecto':cc.ammountHidden,
                'Margen Bruto':Number(cc.ammountWithOutTaxes)-Number(cc.ammountHidden),
                'Margen Neto':cc.netMargin,
                'Comisión %':cc.comission,
                'Comisión':Number(cc.netMargin)*(Number(cc.comission)/100),
                'Centro de costos':`https://clientes.edulink.la/cc/view/${btoa(cc.id)}`,
            }
            return costCenter
        })
        try {
            const opts = {};
            const parser = new Parser(opts);
            const csv = parser.parse(filterData);
            res.set({
                'Content-Type':'text/csv',
                'Content-Disposition':`attachment; filename="prueba.csv"`
            })
            const readStream = new Readable({encoding:'utf-8'})
            readStream.push(csv,'utf-8')
            readStream.push(null)
            
            readStream.pipe(res)
          } catch (err) {
            console.error(err);
          }
    }
}