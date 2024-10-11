// import puppeteer from "puppeteer";
// import Handlebars from "handlebars";
// import {join} from 'path'
// import { cwd } from "process";
// import fs from 'fs'
import moment from "moment";
import { Parser } from '@json2csv/plainjs/index.js';
import {Readable} from 'stream'
import { Op } from "sequelize";
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

    async addIndex(req,res){
        const data = await this.productSelledService.addIndex()
        return res.json({
            data
        })
    }

    async updateProductPlusTo(req,res){
        const data = await this.productSelledService.updateProductPlusTo()
        return res.json({
            data
        })
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

        const userRoleNames = user_exist['UserRoles'].map(usr=>usr['Role']['name'])

        if(userRoleNames.includes('ADMIN') || userRoleNames.includes('BILLER')){
            return{
                ok:true
            }
        }
        // if(user_exist['UserRoles'][0]['Role']['name'] === 'ADMIN'){
        //     return{
        //         ok:true
        //     }
        // }
        // if(user_exist['UserRoles'][0]['Role']['name'] === 'BILLER'){
        //     return{
        //         ok:true
        //     }
        // }

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

            // req.body['products'].forEach(async(pd)=>{
            //     pd['cost_center_id'] = costCenter['id'];
            //     await this.productSelledService.create(pd);
            // })

            for (const pd of req.body['products']) {
                pd['cost_center_id'] = costCenter['id'];
                await this.productSelledService.create(pd);
            }

            if(req.body['costCenterTasks']){
                for (const cct of req.body['costCenterTasks']) {
                    cct['cost_center_id'] = costCenter['id'];
                    await this.costCenterService.createCostCenterTask(cct);
                }
            }

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
            'currency' in req.body === false
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
            // const productsToCreate= req.body['products'].filter(p=> ('id' in p)===false)
    
            // productsToCreate.forEach(async(pd)=>{
            //     pd['cost_center_id'] = req.body['id'];
            //     await this.productSelledService.create(pd);
            // })
    
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

            if(req.body['newCostCenterTasks'] && req.body['newCostCenterTasks'].length > 0){
                for (const costCenterTask of req.body['newCostCenterTasks']) {
                    await this.costCenterService.createCostCenterTask(costCenterTask)
                }
            }

            if(req.body['delCostCenterTasks'] && req.body['delCostCenterTasks'].length > 0){
                for (const costCenterTask of req.body['delCostCenterTasks']) {
                    await this.costCenterService.deleteCostCenterTask({id:costCenterTask['id']})
                }
            }

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

                if(req.body['costCenterProcessesToCreate'] && req.body['costCenterProcessesToCreate'].length > 0){
                    for (const costCenterProcess of req.body['costCenterProcessesToCreate']) {
                       const newCcProcess = await this.costCenterService.createCostCenterProcess(costCenterProcess)
                       console.log(newCcProcess)
                        for (const usersTask of costCenterProcess['usersTasks']) {
                            const cost_center_process_id = newCcProcess['id']
                            usersTask['cost_center_process_id'] = cost_center_process_id
                            await this.costCenterService.createCostCenterProcessUserTask(usersTask)
                        }
                    }
                }

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
        if('costumer_id' in req.query){
			where['costumer_id'] = req.query['costumer_id'];
		}
        if('sale_id' in req.query){
			where['sale_id'] = req.query['sale_id'];
		}

        if('task' in req.query){
			where['tasks'] = {
                [Op.like]: `%${req.query['task']}%`
            }
		}

        if('admin_commentary' in req.query){
            if(req.query['admin_commentary']==="Y"){
                where['admin_commentary'] = {
                    [Op.not]: null
                }
            }
            if(req.query['admin_commentary']==="N"){
                where['admin_commentary'] = null;
            }
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
            'tasks',
            'payments_months',
            'product_selled_drive_folder',
            'admin_commentary'
        ]

        let limit = undefined;
        let offset = undefined;

        if('limit' in req.query){   
            limit = Number(req.query['limit'])
        }

        if('offset' in req.query){   
            offset = Number(req.query['offset'])
        }
        let requiredInvoices = undefined;
        if('invoices' in req.query){
			if(req.query['invoices'] === 'Y'){
                requiredInvoices = true;
            }
            if(req.query['invoices'] === 'N'){
                const allCostsCenters = await this.costCenterService.findAllSimple(where,['id'],['invoice']);
                const arrayCostsCenters = allCostsCenters.map(acc=>acc.dataValues)
                const costCenterFilter = arrayCostsCenters.filter(acc=>acc.Invoices.length === 0);
                const costCenterIds = costCenterFilter.map(acc=>acc['id'])
                where['id'] = {
                    [Op.in]: costCenterIds
                }
            }
		}
        try {

            let order = undefined

            if('orderBy' in req.query){
                order = [[req.query['orderBy'],'DESC']]
            }

            const costsCenters = await this.costCenterService.findAll(where,attributes,limit,offset,requiredInvoices,order)
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
        if('costumer_id' in req.query){
			where['costumer_id'] = req.query['costumer_id'];
		}
        if('sale_id' in req.query){
			where['sale_id'] = req.query['sale_id'];
		}
        if('task' in req.query){
			where['tasks'] = {
                [Op.like]: `%${req.query['task']}%`
            }
		}

        let requiredInvoices = undefined;
        if('invoices' in req.query){
			if(req.query['invoices'] === 'Y'){
                requiredInvoices = true;
            }
            if(req.query['invoices'] === 'N'){
                where['$Invoices.id$'] = null;
            }
		}

        if('admin_commentary' in req.query){
            if(req.query['admin_commentary']==="Y"){
                where['admin_commentary'] = {
                    [Op.not]: null
                }
            }
            if(req.query['admin_commentary']==="N"){
                where['admin_commentary'] = null;
            }
		}

        try {
            const totalItems = await this.costCenterService.countAll(where,requiredInvoices)
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
                    'tasks',
                    'payments_months',
                    'product_selled_drive_folder',
                    'admin_commentary'
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
            payments_months:req.body['payments_months'],
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

    async createTaskItem(req,res){
        if('name' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar un nombre'
            })
        }
        try {
            const costCenterTaskItem = await this.costCenterService.createTaskItem(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                costCenterTaskItem
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateTaskItem(req,res){
        if('id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe enviar el ID del item'
            })
        }
        if('name' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar un nombre'
            })
        }
        try {
            const where = {
                id:req.body['id']
            }
            await this.costCenterService.updateTaskItem(req.body,where)
            return res.json({
                ok:true,
                message:'Actualizado correctamente',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async findAllTaskItem(req,res){
        try {
            const where = {}
            const attributes = [
                'id',
                'name'
            ]
            const costCenterTaskItems = await this.costCenterService.findAllTaskItem(where,attributes)
            return res.json({
                ok:true,
                message:'Todas las tareas de CC',
                costCenterTaskItems
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async deleteTaskItem(req,res){
        try {
            await this.costCenterService.deleteTaskItem(req.params['id'])
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

    async createTaskUserItem(req,res){
        if('index' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar índice del item'
            })
        }
        if('name' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el nombre del item'
            })
        }
        if('user_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del usuario'
            })
        }
        if('cost_center_task_item_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del proceso'
            })
        }
        try {
            const costCenterTaskUserItem = await this.costCenterService.createTaskUserItem(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                costCenterTaskUserItem
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createMultipleTaskUserItem(req,res){
        if('taskUserItems' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar los items a crear'
            })
        }

        if('cost_center_task_item_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del proceso'
            })
        }

        let messageError = null

        for (const body of req.body['taskUserItems']) {
            if('index' in body == false){
                messageError = 'Debe proporcionar índice en todos los items'
                break
            }
            if('name' in body == false){
                messageError = 'Debe proporcionar el nombre en todos los items'
                break
            }
            if('user_id' in body == false){
                messageError = 'Debe proporcionar ID del usuario en todos los items'
                break
            }
            if('cost_center_task_item_id' in body == false){
                messageError = 'Debe proporcionar ID del proceso en todos los items'
                break
            }
        }

        if(messageError){
            return res.json({
                ok:false,
                message:messageError
            })
        }

        try {

            await this.costCenterService.deleteMultipleTaskUserItem({
                cost_center_task_item_id:req.body['cost_center_task_item_id']
            })

            const costCenterTaskUserItems = []
            for (const body of req.body['taskUserItems']){
                const costCenterTaskUserItem = await this.costCenterService.createTaskUserItem(body)
                costCenterTaskUserItems.push(costCenterTaskUserItem)
            }
            return res.json({
                ok:true,
                message:'Guardado correctamente',
                costCenterTaskUserItems
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateTaskUserItem(req,res){
        if('id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del item'
            })
        }
        if('index' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar índice del item'
            })
        }
        if('name' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el nombre del item'
            })
        }
        if('user_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del usuario'
            })
        }
        if('cost_center_task_item_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar ID del proceso'
            })
        }

        const where = { id:req.body['id'] }

        try {
            await this.costCenterService.updateTaskUserItem(req.body,where)
            return res.json({
                ok:true,
                message:'Actualizado correctamente',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async deleteTaskUserItem(req,res){
        try {
            await this.costCenterService.deleteTaskUserItem(req.params['id'])
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

    async findAllCostCenterProcess(req,res){
        const where = {}

        if('cost_center_id' in req.query){
            where['cost_center_id'] = req.query['cost_center_id']
        }
        if('cost_center_task_item_id' in req.query){
            where['cost_center_task_item_id'] = req.query['cost_center_task_item_id']
        }
        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }
        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }
        if('was_started' in req.query){
            where['was_started'] = req.query['was_started']
        }

        try {
            const costCenterProcesses = await this.costCenterService.findAllCostCenterProcess(where)

            return res.json({
                ok:true,
                message:'Todos los procesos',
                costCenterProcesses
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createCostCenterProcessUserTask(req,res){
        if('cost_center_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el ID del centro de costos'
            })
        }
        if('cost_center_process_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el ID del proceso'
            })
        }
        if('index' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el índice de la tarea'
            })
        }
        if('name' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el nombre de  la tarea'
            })
        }
        if('user_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el ID del usuario designado'
            })
        }
        if('start_date' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar la fecha de inicio de la tarea'
            })
        }
        if('deadline' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar la fecha límite de la tarea'
            })
        }
        if('state' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el estado de la tarea'
            })
        }

        try {
            const costCenterProcessUserTask = await this.costCenterService.createCostCenterProcessUserTask(req.body)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                costCenterProcessUserTask
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createMultipleCostCenterProcessUserTask(req,res) {
        if('processUserTasks' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar las tareas a crear'
            })
        }

        if('cost_center_process_id' in req.body == false){
            return res.json({
                ok:false,
                message:'Debe proporcionar el ID del proceso'
            })
        }

        let messageError = null

        for (const body of req.body['processUserTasks']) {
            if('cost_center_id' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el ID del centro de costos'
                break;
            }
            if('cost_center_process_id' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el ID del proceso'
                break;
            }
            if('index' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el índice de la tarea'
                break;
            }
            if('name' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el nombre de  la tarea'
                break;
            }
            if('user_id' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el ID del usuario designado'
                break;
            }
            if('start_date' in body == false){
                messageError = 'Debe proporcionar en todas las tareas la fecha de inicio de la tarea'
                break;
            }
            if('deadline' in body == false){
                messageError = 'Debe proporcionar en todas las tareas la fecha límite de la tarea'
                break;
            }
            if('state' in body == false){
                messageError = 'Debe proporcionar en todas las tareas el estado de la tarea'
                break;
            }
        }

        if(messageError){
            return res.json({
                ok:false,
                message:messageError
            })
        }

        try {
            const costCenterProcessUserTasks = []
            for (const body of req.body['processUserTasks']){
                const costCenterProcessUserTask = await this.costCenterService.createCostCenterProcessUserTask(body)
                costCenterProcessUserTasks.push(costCenterProcessUserTask)
            }
            await this.costCenterService.updateCostCenterProcess({with_settings:'Y'},{id:req.body['cost_center_process_id']})
            return res.json({
                ok:true,
                message:'Guardado correctamente',
                costCenterProcessUserTasks
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateMultipleCostCenterProcessUserTask(req,res){
        try {
            if('processUserTaskToDelete' in req.body && req.body['processUserTaskToDelete'].length > 0){
                for (const id of req.body['processUserTaskToDelete']) {
                    await this.costCenterService.destroyCostCenterProcessUserTask({id})
                }
            }
    
            if('processUserTasksToUpdate' in req.body && req.body['processUserTasksToUpdate'].length > 0){
                for (const processUserTaskToUpdate of req.body['processUserTasksToUpdate']) {
                    const { where, index, name, start_date, deadline } = processUserTaskToUpdate;
                    const item = {
                        index,
                        name,
                        start_date,
                        deadline 
                    }
                    await this.costCenterService.updateCostCenterProcessUserTask(item,where)
                }
            }
    
            if('newProcessUserTasks' in req.body && req.body['newProcessUserTasks'].length > 0){
                for (const processUserTaskNew of req.body['newProcessUserTasks']) {
                    const {
                        cost_center_id,
                        cost_center_process_id,
                        index,
                        name,
                        user_id,
                        start_date,
                        deadline,
                        state
                    } = processUserTaskNew;
                    const item = {
                        cost_center_id,
                        cost_center_process_id,
                        index,
                        name,
                        user_id,
                        start_date,
                        deadline,
                        state
                    }
                    await this.costCenterService.createCostCenterProcessUserTask(item)
                }
            }

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

    async updateCostCenterProcess(req,res){

        const where = {
            id: req.params['id']
        }

        try {
            await this.costCenterService.updateCostCenterProcess(req.body,where)

            if(req.body['init_process'] && req.body['firstTasks']){
                // ACTUALIZAR TAREAS
                for (const task of req.body['firstTasks']) {
                    await this.costCenterService.updateCostCenterProcessUserTask({state:'PENDING'},{id:task['id']})
                }

                return res.json({
                    ok:true,
                    message:'Proceso iniciado correctamente'
                })
            }

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

    async findAllCostCenterProcessUserTask(req,res){
        const where = {}

        const attributes = undefined

        let limit = undefined
        let offset = undefined

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }
        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }
        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }
        if('index' in req.query){
            where['index'] = Number(req.query['index'])
        }
        if('state' in req.query){
            where['state'] = req.query['state']
        }
        if('cost_center_process_id' in req.query){
            where['cost_center_process_id'] = req.query['cost_center_process_id']
        }
        if('limit' in req.query){
            limit = Number(req.query['limit'])
        }
        if('offset' in req.query){
            offset = Number(req.query['offset'])
        }

        try {
            const costCenterProcessUserTasks = await this.costCenterService.findAllCostCenterProcessUserTask(where,attributes,limit,offset)
            return res.json({
                ok:true,
                message:'Todas las tareas',
                costCenterProcessUserTasks
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }

    }

    async countAllCostCenterProcessUserTask(req,res){
        const where = {}

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }
        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }
        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }
        if('state' in req.query){
            where['state'] = req.query['state']
        }

        try {
            const totalItems = await this.costCenterService.countAllCostCenterProcessUserTask(where)
            return res.json({
                ok:true,
                message:'Todas las tareas',
                totalItems
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async updateCostCenterProcessUserTask(req,res){
        try {
            const where = {
                id:req.params['id']
            }

            await this.costCenterService.updateCostCenterProcessUserTask(req.body,where)        

            if('state' in req.body && req.body['state'] === 'SUCCESS'){
                const nextUserTasks = await this.costCenterService.findAllCostCenterProcessUserTask({
                    cost_center_process_id:req.body['cost_center_process_id'],
                    index:req.body['nextIndex']
                },['id'])

                const nextUserTasksValues = nextUserTasks.map(n=>n.dataValues)
                for (const ut of nextUserTasksValues) {
                    await this.costCenterService.updateCostCenterProcessUserTask({state:'PENDING'},{id:ut['id']})
                }
                // if(nextUserTask){
                //     const {id} = nextUserTask.dataValues;
                //     await this.costCenterService.updateCostCenterProcessUserTask({state:'PENDING'},{id})
                // }
                if('forAllUsers' in req.body){
                    for (const user of req.body['usersWithNotSucessTasks']) {
                        await this.costCenterService.updateCostCenterProcessUserTask({state:'SUCCESS',end_date:req.body['end_date']},{
                            cost_center_process_id:req.body['cost_center_process_id'],
                            index:Number(req.body['nextIndex']) - 1,
                            user_id:user['id']
                        })
                    }
                }
            }

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

    async updateProductSelled(req,res){
        try {
            await this.productSelledService.update(req.body,{id:req.params['id']})
            return res.json({
                ok:true,
                message:'Comentario guardado',
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

}