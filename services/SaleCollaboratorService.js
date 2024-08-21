import SaleCollaborator from "../models/saleCollaborator.model.js";
import User from "../models/user.model.js";
import Costumer from "../models/costumer.model.js";
import Sale from "../models/sale.model.js";

export default class SaleCollaboratorService {
    
    async create(saleCollaborator){
        const {
            costumer_id,
            sale_id,
            user_id,
            drive_folder_id
        } = saleCollaborator;

        const newSaleCollaborator = SaleCollaborator.build({
            costumer_id,
            sale_id,
            user_id,
            drive_folder_id
        });

        const n_saleCollaborator = await newSaleCollaborator.save();

        return n_saleCollaborator
    }

    async update(saleCollaborator,where){
        const {
            costumer_id,
            sale_id,
            user_id,
            drive_folder_id
        } = saleCollaborator;

        const updtSaleCollaborator = await SaleCollaborator.update({
            costumer_id,
            sale_id,
            user_id,
            drive_folder_id
        },{ where });

        return updtSaleCollaborator
    }

    async delete(where){
        const delSaleCollaborator = await SaleCollaborator.destroy({where})
        return delSaleCollaborator
    }

    async findAll(where,attributes=undefined,models=undefined){

        let include = undefined;

        if(models){
            include = []
            if(models.includes('user')){
                include.push({
                    model:User
                })
            }

            if(models.includes('costumer')){
                include.push({
                    model:Costumer
                })
            }

            if(models.includes('sale')){
                include.push({
                    model:Sale
                })
            }
        }

        const saleCollaborators = await SaleCollaborator.findAll({
            where,
            attributes,
            include
        })

        return saleCollaborators
    }

    async findOne(where,attributes=undefined,models=undefined){

        let include = undefined;

        if(models){
            include = []
            if(models.includes('user')){
                include.push({
                    model:User
                })
            }

            if(models.includes('costumer')){
                include.push({
                    model:Costumer
                })
            }

            if(models.includes('sale')){
                include.push({
                    model:Sale
                })
            }
        }

        const saleCollaborator = await SaleCollaborator.findOne({
            where,
            attributes,
            include
        })

        return saleCollaborator
    }

};
