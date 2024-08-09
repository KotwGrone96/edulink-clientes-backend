import CostCenter from "../models/costCenter.model.js";
import Costumer from "../models/costumer.model.js";
import Sale from "../models/sale.model.js";
import SaleTask from "../models/saleTask.model.js";
import User from "../models/user.model.js";
import UserCostumer from "../models/userCostumer.model.js";
import { timeZoneLima } from "../timezone.js";

export default class SaleService{
    async create(sale){
        const {
            name,
            costumer_id,
            user_id,
            start_date,
            end_date,
            state,
            type,
            ammount,
            currency,
            description,
            notes,
            sale_close_email
                } = sale;    
        
        const new_sale = Sale.build({
            name,
            costumer_id,
            user_id,
            start_date,
            end_date,
            state,
            type,
            ammount,
            currency,
            description,
            notes ,
            sale_close_email,
            created_at:timeZoneLima()
        });
        const n_sale = await new_sale.save();
        return n_sale;
    }

    async update(sale,where){
        const {        
            costumer_id,
            user_id,
            start_date,
            end_date,
            state,
            type,
            ammount,
            currency,
            description,
            notes,
            name,
            purchase_order,
            folder,
            sale_close_email,
            } = sale;  

        const updt_sale = await Sale.update({
            costumer_id,
            user_id,
            start_date,
            end_date,
            state,
            type,
            ammount,
            currency,
            description,
            notes,
            name,
            purchase_order,
            folder,
            sale_close_email,
            updated_at:timeZoneLima()
        },{ where })

        return updt_sale;
    }

    async findAll(where,attributes){
        const sales = await Sale.findAll({ where,
            attributes,
            include:[
                {
                    model:User,
                },
                {
                    model:CostCenter,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:SaleTask,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:Costumer,
                    where:{deleted_at:null},
                }
            ],
            order:[['start_date','DESC']]
        });

        return sales
    }

    async findAllCustomInclude(where,attributes, models){
        const include = []

        if(models.includes('user')){
            const includeModel = {
                model:User,
                where:{deleted_at:null},
                required:false
            }
            include.push(includeModel)
        }
        if(models.includes('cost_center')){
            const includeModel = {
                model:CostCenter,
                where:{deleted_at:null},
                required:false
            }
            include.push(includeModel)
        }
        if(models.includes('sale_task')){
            const includeModel = {
                model:SaleTask,
                where:{deleted_at:null},
                required:false
            }
            include.push(includeModel)
        }
        if(models.includes('costumer')){
            const includeModel = {
                model:Costumer,
                where:{deleted_at:null},
                required:false
            }
            include.push(includeModel)
        }

        const sales = await Sale.findAll({ where,
            attributes,     
            include,
            order:[['start_date','DESC']]
        });

        return sales
    }

    async findOne(where,attributes){
        const sale = await Sale.findOne({ where,
            attributes,
            include:[
                {
                    model:User
                },
                {
                    model:Costumer,
                    include:[
                        {
                            model:UserCostumer
                        }
                    ]
                },
                {
                    model:CostCenter,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:SaleTask,
                    where:{deleted_at:null},
                    required:false
                }
            ]
        });

        return sale
    }

    async delete(id){
        const updt_sale = await Sale.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });

        return updt_sale;
    }
}