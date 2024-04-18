import CostCenter from "../models/costCenter.model.js";
import Sale from "../models/sale.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";

export default class CostCenterService{

    async create(costCenter){
        const { 
            user_id,
            sale_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment
        } = costCenter;

        const newCostCenter = CostCenter.build({
            user_id,
            sale_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            created_at:timeZoneLima()
        });

        const n_costCenter = await newCostCenter.save();
        return n_costCenter;
    }

    async update(costCenter,where){
        const { 
            user_id,
            sale_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment
        } = costCenter;

        const updt_costCenter = await CostCenter.update({
            user_id,
            sale_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            updated_at:timeZoneLima()
        },{ where })
        
        return updt_costCenter;
    }

    async findAll(where,attributes){
        const costsCenters = await CostCenter.findAll({ where,
            attributes,
            include:[
                {
                    model:User,

                },
                {
                    model:Sale
                }
            ]
        });

        return costsCenters;
    }

    async findOne(where,attributes){
        const costCenter = await CostCenter.findOne({ where,
            attributes,
            include:[
                {
                    model:User,

                },
                {
                    model:Sale
                }
            ]
        });

        return costCenter;
    }

    async delete(id){
        const updt_costCenter = await CostCenter.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });

        return updt_costCenter;
    }
}