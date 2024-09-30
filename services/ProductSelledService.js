import CostCenter from "../models/costCenter.model.js";
import ProductSelled from "../models/productSelled.model.js";
import { timeZoneLima } from "../timezone.js";
import ProductSelledDriveFile from "../models/productSelledDriveFile.model.js";

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

    async createProductSelledDriveFile(productSelledDriveFile){
        const {
            owner_id,
            costumer_id,
            sale_id,
            cost_center_id,
            product_selled_id,
            drive_id,
            name
        } = productSelledDriveFile;

        const newDriveFile = ProductSelledDriveFile.build({
            owner_id,
            costumer_id,
            sale_id,
            cost_center_id,
            product_selled_id,
            drive_id,
            name
        })

        const n_driveFile = await newDriveFile.save()
        return n_driveFile
    }

    async findAllProductSelledDriveFile(where,attributes=undefined){
        const productSelledDriveFiles = await ProductSelledDriveFile.findAll({
            where,
            attributes
        })
        return productSelledDriveFiles
    }

    async updateProductSelledDriveFile(productSelledDriveFile,where){
        const {
            owner_id,
            costumer_id,
            sale_id,
            cost_center_id,
            product_selled_id,
            drive_id,
            name
        } = productSelledDriveFile;

        const updtDriveFile = await ProductSelledDriveFile.update({
            owner_id,
            costumer_id,
            sale_id,
            cost_center_id,
            product_selled_id,
            drive_id,
            name
        },{where})

        return updtDriveFile
    }

    async updateCostCenterProductsFolder(costCenter,where){
        const { product_selled_drive_folder } = costCenter;
        const updtCC = await CostCenter.update({
            product_selled_drive_folder
        },{where})
        return updtCC
    }

    async deleteProductSelledDriveFile(where){
        const delDriveFile = await ProductSelledDriveFile.destroy({where})
        return delDriveFile
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

    async updateProductPlusTo(){
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

        let rowsAffected = 0

        for (const cc of arrayCCs) {
            const { ProductSelleds } = cc
            
            const psToUpdate = ProductSelleds.filter(ps=>{
                if(!ps.plus_to || ps.plus_to.trim().length === 0) return false
                return true
            })
            
            for (const pstu of psToUpdate) {
                const findedProduct = ProductSelleds.find(p=>p.part_number === pstu.plus_to)
                if(findedProduct){
                    // const updt = await ProductSelled.update({
                    //     plus_to:findedProduct.id
                    // },{where:{id:pstu.id}})

                    // rowsAffected += updt[0]
                }
            }
        }

        return `${rowsAffected} fueron afectadas`
    }
}