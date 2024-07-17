import { Parser } from '@json2csv/plainjs/index.js';
import {Readable} from 'stream'
import moment from 'moment';

export default class SaleController{

    saleService
    costumerSerivce
    userService
    saleHistoryService
    saleTaskService

    constructor(saleService,costumerService,userService,saleHistoryService,saleTaskService){
        this.saleService = saleService
        this.costumerSerivce = costumerService
        this.userService = userService
        this.saleHistoryService = saleHistoryService
        this.saleTaskService = saleTaskService
    }

    async validatePermission(payload){
        const costumer_exist = await this.costumerSerivce.findOne({
            deleted_at:null,
            id:payload['costumer_id']
        },['id','manager_id'])

        if(!costumer_exist){
            return {
                ok:false,
                message:'El cliente no existe o fue eliminado'
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

        let isManager = false;

        if(`${costumer_exist['manager_id']}` === `${user_exist['id']}`){
            isManager = true;
        }else{
            const usersCostumersIds = costumer_exist['UserCostumers'].map(uc=>`${uc['user_id']}`)
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
            'name' in req.body === false||
            'costumer_id' in req.body === false||
            'user_id' in req.body === false||
            'start_date' in req.body === false||
            'state' in req.body === false||
            'type' in req.body === false||
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

        try {
            const sale = await this.saleService.create(req.body)
            const saleHistory = {
                costumer_id:sale['costumer_id'],
                sale_id:sale['id'],
                user_id:sale['user_id'],
                type:'CREATE',
                state:sale['state']
            }
            await this.saleHistoryService.create(saleHistory)
            return res.json({
                ok:true,
                message:'Creado correctamente',
                sale
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
            'costumer_id' in req.body === false||
            'user_id' in req.body === false||
            'start_date' in req.body === false||
            'state' in req.body === false||
            'type' in req.body === false||
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
        try {
            await this.saleService.update(req.body,{deleted_at:null,id:req.body['id']});

            const saleHistory = {
                costumer_id:req.body['costumer_id'],
                sale_id:req.body['id'],
                user_id:req.body['user_id'],
                type:'UPDATE',
                state:req.body['state'],
                attribute:req.body['attribute']
            }
            await this.saleHistoryService.create(saleHistory)

            return res.json({
                ok:true,
                message:'Actualizado correctamente'
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al actualizar el registro',
                error
            })
        }

    }
    
    async findAll(req,res){

        const where = { deleted_at:null }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }

        try {
            const sales = await this.saleService.findAll(
                where,
                ['id',
                'costumer_id',
                'user_id',
                'start_date',
                'end_date',
                'state',
                'type',
                'ammount',
                'currency',
                'description',
                'notes',
                'name',
                'purchase_order',
                'folder',
                'sale_close_email',
                'created_at']
            )
            
            return res.json({
                ok:true,
                message:'Todos las ventas',
                sales
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar las ventas',
                error
            })
        }
    }

    async findOne(req,res){
        try {
            const sale = await this.saleService.findOne(
                {
                    deleted_at:null,
                    id:req.params['id']
                },
                ['id',
                'costumer_id',
                'user_id',
                'start_date',
                'end_date',
                'state',
                'type',
                'ammount',
                'currency',
                'description',
                'notes',
                'name',
                'purchase_order',
                'folder',
                'sale_close_email',
                'created_at']
            )
            
            return res.json({
                ok:true,
                message:'Venta encontrada',
                sale
            })

        } catch (error) {
            return res.json({
                ok:false,
                message:'Error al solicitar la venta',
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
            await this.saleService.delete(req.params['id']);
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

    async createSaleTask(req,res){
        if(
            'name' in req.body === false ||
            'description' in req.body === false ||
            'sale_id' in req.body === false ||
            'designated_user' in req.body === false ||
            'state' in req.body === false ||
            'deadline' in req.body === false 
        ){
           return res.json({
            ok:false,
            message:'Faltan datos por enviar'
           }) 
        }
        try {
            const saleTask = await this.saleTaskService.create(req.body);
            return res.json({
                ok:true,
                message:'Tarea creada',
                saleTask
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            }) 
        }
    }

    async updateSaleTask(req,res){
        if(
            'id' in req.body === false ||
            'name' in req.body === false ||
            'description' in req.body === false ||
            'sale_id' in req.body === false ||
            'designated_user' in req.body === false ||
            'state' in req.body === false ||
            'deadline' in req.body === false 
        ){
           return res.json({
            ok:false,
            message:'Faltan datos por enviar'
           }) 
        }

        const where = {
            id:req.body['id']
        }

        try {
            const saleTask = await this.saleTaskService.update(req.body,where);
            return res.json({
                ok:true,
                message:'Tarea actualizada',
                saleTask
            })
            
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            }) 
        }
    }

    async findAllSaleTask(req,res){
        const where = { deleted_at:null }

        if('designated_user' in req.query){
            where['designated_user'] = req.query['designated_user']
        }
        if('sale_id' in req.query){
            where['sale_id'] = req.query['sale_id']
        }

        const attributes = [
            'id',
            'name',
            'description',
            'state',
            'commentary',
            'deadline',
            'end_date',
            'created_at'
        ]
        try {
            const saleTasks = await this.saleTaskService.findAll(where,attributes);
            return res.json({
                ok:true,
                message:'Todas las tareas',
                saleTasks
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            }) 
        }
    }

    async findOneSaleTask(req,res){
        const where = { 
            deleted_at:null,
            id:req.params['id']
        }

        const attributes = [
            'id',
            'name',
            'description',
            'state',
            'commentary',
            'deadline',
            'end_date',
            'created_at'
        ]
        try {
            const saleTask = await this.saleTaskService.findOne(where,attributes);
            return res.json({
                ok:true,
                message:'Todas las tareas',
                saleTask
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            }) 
        }
    }

    async deleteTask(req,res){
        try {
            await this.saleTaskService.delete(req.params['id']);
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

    async csvAllData(req,res){

        const where = { deleted_at:null }

        if('costumer_id' in req.query){
            where['costumer_id'] = req.query['costumer_id']
        }

        if('user_id' in req.query){
            where['user_id'] = req.query['user_id']
        }

        const attributes = [
            'id',
            'costumer_id',
            'user_id',
            'start_date',
            'end_date',
            'state',
            'type',
            'ammount',
            'currency',
            'description',
            'notes',
            'name',
            'purchase_order',
            'folder',
            'sale_close_email',
            'created_at'
        ]
            
        const models = ['user','cost_center','costumer']

        try {
            const sales = await this.saleService.findAllCustomInclude(
                where,
                attributes,
                models
            )
            
            const arraySales = sales.map(s=>s.dataValues)

            const stateTranslates = {
                PENDING:'En proceso',
                SENDED:'Propuesta enviada',
                NEGOTIATION:'Negociación',
                REJECTED:'Rechazado',
                WIN:'Ganado'
            }

            const typeTranslate = {
                OPORTUNITY:'Oportunidad',
                SALE:'Venta'
            }

            const filterData = arraySales.map(s=>{
                const cc = s.CostCenters.length > 0? s.CostCenters[0]:null;
                const saleFilter = {
                    'ID de negocio':s.id,
                    'ID de cliente':s.costumer_id,
                    'Cliente':s.Costumer.name,
                    'ID del creador':`${s.user_id}`,
                    'Creador':`${s.User.name} ${s.User.lastname}`,
                    'Fecha de inicio':moment(s.start_date).format('YYYY-MM-DD HH:mm'),
                    'Estado':stateTranslates[s.state],
                    'Fecha de finalización':s.end_date && s.end_date.length > 0?moment(s.end_date).format('YYYY-MM-DD HH:mm'):'',
                    'Tipo de negocio':typeTranslate[s.type],
                    'Nombre':s.name,
                    'Descripción':s.description,
                    'Google Drive':s.folder,
                    'Orden de compra':s.purchase_order,
                    'ID centro de costos':cc?cc.id:'',
                    'Centro de costos':cc?`https://clientes.edulink.la/cc/view/${btoa(cc.id)}`:'',
                    'Moneda':s.currency,
                    'Total de venta':cc?cc.ammountTotal:'',
                    'Total sin IGV':cc?cc.ammountWithOutTaxes:'',
                    'IGV':cc?cc.ammountTaxes:'',
                    'Costo oculto del proyecto':cc?cc.ammountHidden:'',
                    'Margen Bruto':cc?Number(cc.ammountWithOutTaxes)-Number(cc.ammountHidden):'',
                    'Margen Neto':cc?cc.netMargin:'',
                    'Comisión %':cc?cc.comission:'',
                    'Comisión':cc?Number(cc.netMargin)*(Number(cc.comission)/100):''
                }
                return saleFilter
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

        } catch (error) {
            console.error(err);
        }
    }
}