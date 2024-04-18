import CostCenter from "../models/costCenter.model.js";
import Costumer from "../models/costumer.model.js";
import Sale from "../models/sale.model.js";
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
            notes 
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
            notes 
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
            updated_at:timeZoneLima()
        },{ where })

        return updt_sale;
    }

    async findAll(where,attributes){
        const sales = await Sale.findAll({ where,
            attributes,
            include:[
                {
                    model:User
                },
                {
                    model:Costumer
                },
                {
                    model:CostCenter
                }
            ]
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
                    model:CostCenter
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