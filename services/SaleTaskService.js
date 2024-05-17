import Costumer from "../models/costumer.model.js";
import Sale from "../models/sale.model.js";
import SaleTask from "../models/saleTask.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";

export default class SaleTaskService {
    
    async create(saleTask){
        const { name, description, sale_id, designated_user, state, deadline } = saleTask;
        const newSaleTask = SaleTask.build({
            name,
            description,
            sale_id,
            designated_user,
            state,
            deadline,
            created_at:timeZoneLima()
        })
        const n_saleTask = await newSaleTask.save();
        return n_saleTask
    }

    async update(saleTask, where){
        const { 
            name,
            description, 
            sale_id, 
            designated_user, 
            state,
            commentary,
            deadline,
            end_date,
        } = saleTask;
        const updt_saleTask = await SaleTask.update({
            name,
            description, 
            sale_id, 
            designated_user, 
            state,
            commentary,
            deadline,
            end_date,
            updated_at:timeZoneLima()
        },{where })
        return updt_saleTask
    }

    async findAll(where,attributes){
        const saleTasks = await SaleTask.findAll({
            where,
            attributes,
            include:[
                {
                    model:User
                },
                {
                    model:Sale,
                    include:[
                        {
                            model:Costumer
                        }
                    ]
                }
            ]
        })
        return saleTasks
    }

    async findOne(where,attributes){
        const saleTask = await SaleTask.findOne({
            where,
            attributes,
            include:[
                {
                    model:User
                },
                {
                    model:Sale,
                    include:[
                        {
                            model:Costumer
                        }
                    ]
                }
            ]
        })
        return saleTask
    }

    async delete(id){
        const updt_saleTask = await SaleTask.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });

        return updt_saleTask;
    }
};
