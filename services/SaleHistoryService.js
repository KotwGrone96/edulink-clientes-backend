import SaleHistory from "../models/saleHistory.model.js";
import { timeZoneLima } from "../timezone.js";

export default class SaleHistoryService {
    async create(saleHistory){
        const { costumer_id, sale_id, user_id, type, state } = saleHistory;
        const newSaleHistory = SaleHistory.build({
            costumer_id,
            sale_id,
            user_id,
            type,
            state,
            created_at:timeZoneLima()
        })
        const n_saleHistory = await newSaleHistory.save()
        return n_saleHistory
    }

   async findAll(where){
        if(Object.keys(where).length === 0){
            where = undefined
        }
        const salesHistories = await SaleHistory.findAll({where})
        return salesHistories
   }
   async findOne(where){
        if(Object.keys(where).length === 0){
            where = undefined
        }
        const saleHistory = await SaleHistory.findOne({where})
        return saleHistory
    }
};
