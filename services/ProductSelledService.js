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
            purchase_price,
            sale_price,
            type,
            provider,
            porcentage,
            isVisible,
            plus_to,
            commentary,
            admin_commentary,
            hide_index,
            public_index
        } = productSelled;

        const newProductSelled = ProductSelled.build({
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            purchase_price,
            sale_price,
            type,
            provider,
            porcentage,
            isVisible,
            plus_to,
            commentary,
            admin_commentary,
            hide_index,
            public_index,
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
            purchase_price,
            sale_price,
            type,
            provider,
            porcentage,
            isVisible,
            plus_to,
            commentary,
            admin_commentary,
            hide_index,
            public_index
        } = productSelled;
        const updt_productSelled = await ProductSelled.update({
            cost_center_id,
            part_number,
            name,
            quantity,
            price,
            purchase_price,
            sale_price,
            type,
            provider,
            porcentage,
            isVisible,
            plus_to,
            commentary,
            admin_commentary,
            hide_index,
            public_index,
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
        const del_productSelled = await ProductSelled.destroy({ where:{ id } });
        return del_productSelled;
    }

    async addIndex(){
        const allCCs = await CostCenter.findAll({
            where:{
                deleted_at:null
            },
            include:[
                {
                    model:ProductSelled
                }
            ]
        })

        const arrayCCs = allCCs.map(c=>c.dataValues)

        let productTypes = {}

        for (const cc of arrayCCs){
            if(`${cc.id}` in productTypes) continue
            productTypes[`${cc.id}`] = {}
        }

        for (const cc of arrayCCs) {
            const {ProductSelleds} = cc
            for (const ps of ProductSelleds) {
                if(`${ps.type}` in productTypes[`${cc.id}`]) continue
                productTypes[`${cc.id}`] = {}
            }
            for (const ps of ProductSelleds) {
                productTypes[`${cc.id}`] = {
                    ...productTypes[`${cc.id}`],
                    [`${ps.type}`]:[]
                }
            }
            for (const ps of ProductSelleds) {
                productTypes[`${cc.id}`] = {
                    ...productTypes[`${cc.id}`],
                    [`${ps.type}`]:[...productTypes[`${cc.id}`][`${ps.type}`],ps]
                }
            }
        }

        let rowsAffected = 0

        for (const cc_id in productTypes) {
            const ccProductTypesObj = productTypes[cc_id];
            for (const type in ccProductTypesObj) {
                const arrayProducts = ccProductTypesObj[type]
                for (let index = 0; index < arrayProducts.length; index++) {
                    const p = arrayProducts[index]
                    // console.log(`${type} `,`${p.name} `,index+1)   
                    // const updt = await ProductSelled.update({
                    //     hide_index: `${index+1}`,
                    //     public_index: `${index+1}`
                    // },{where:{id:p.id}})

                    rowsAffected += updt[0]
                };
            }
        }

        return `Filas afectadas ${rowsAffected}`

    }
}