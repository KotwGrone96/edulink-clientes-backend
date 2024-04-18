import CostCenter from "../models/costCenter.model.js";
import ProductSelled from "../models/productSelled.model.js";
import { timeZoneLima } from "../timezone.js";

export default class ProductSelledService{

    async create(productSelled){
        const {
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            type
        } = productSelled;

        const newProductSelled = ProductSelled.build({
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            type,
            created_at:timeZoneLima()
        });
        const n_productSelled = await newProductSelled.save();
        return n_productSelled;

    }

    async update(productSelled,where){
        const {
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            type
        } = productSelled;
        const updt_productSelled = await ProductSelled.update({
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            type,
            updated_at:timeZoneLima()
        },{ where });

        return updt_productSelled;
    }

    async findAll(where,attributes){
        const productsSelled = await ProductSelled.findAll({ where,
            attributes,
            include:[
                {
                    model:CostCenter
                }
            ]
        });

        return productsSelled;
    }

    async findOne(where,attributes){
        const productSelled = await ProductSelled.findOne({ where,
            attributes,
            include:[
                {
                    model:CostCenter
                }
            ]
        });

        return productSelled;
    }

    async delete(id){
        const updt_productSelled = await ProductSelled.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });

        return updt_productSelled;
    }
}