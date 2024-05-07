import CostCenter from "../models/costCenter.model.js";
import { timeZoneLima } from "../timezone.js";

export default class CostCenterHistoryService {
    async create(costCenterHistory){
        const {costumer_id, sale_id, cost_center_id, user_id, action, state} = costCenterHistory;
        const newConstCenterHistory = CostCenter.build({
            costumer_id,
            sale_id,
            cost_center_id,
            user_id,
            action,
            state,
            created_at:timeZoneLima()
        })
        const n_constCenterHistory = await newConstCenterHistory.save()
        return n_constCenterHistory
    }
}
