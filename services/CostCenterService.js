import CostCenter from "../models/costCenter.model.js";
import ProductSelled from "../models/productSelled.model.js";
import Costumer from '../models/costumer.model.js'
import Sale from "../models/sale.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";
import CostCenterApprovals from "../models/costCenterApprovals.model.js";

export default class CostCenterService{

    async create(costCenter){
        const { 
            user_id,
            sale_id,
            costumer_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            date_of_send,
            max_date_of_costumer_attention,
            max_date_of_provider_attention,
            comission,
            state,
            name
        } = costCenter;

        const newCostCenter = CostCenter.build({
            user_id,
            sale_id,
            costumer_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            date_of_send,
            max_date_of_costumer_attention,
            max_date_of_provider_attention,
            comission,
            state,
            name,
            created_at:timeZoneLima()
        });

        const n_costCenter = await newCostCenter.save();
        return n_costCenter;
    }

    async update(costCenter,where){
        const { 
            user_id,
            sale_id,
            costumer_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            date_of_send,
            max_date_of_costumer_attention,
            max_date_of_provider_attention,
            comission,
            state,
            name
        } = costCenter;

        const updt_costCenter = await CostCenter.update({
            user_id,
            sale_id,
            costumer_id, 
            final_costumer, 
            purchase_order_name, 
            costumer_contact,
            phone_or_email,
            currency,
            type_of_payment,
            date_of_send,
            max_date_of_costumer_attention,
            max_date_of_provider_attention,
            comission,
            state,
            name,
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
                    model:Sale,
                },
                {
                    model:ProductSelled
                },

                {
                    model:Costumer
                },
                {
                    model:CostCenterApprovals
                }
            ],
            order:[['created_at','DESC']]
        });

        return costsCenters;
    }

    async findOne(where,attributes){
        const costCenter = await CostCenter.findOne({ where,
            attributes,
            include:[
                {
                    model:Sale,
                    where:{
                        deleted_at:null
                    }
                },
                {
                    model:User,
                    attributes:[
                        'id',
                        'name',
                        'lastname',
                        'email',
                        'state'
                    ]
                },
                {
                    model:ProductSelled
                },
                {
                    model:Costumer
                },
                {
                    model:CostCenterApprovals
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