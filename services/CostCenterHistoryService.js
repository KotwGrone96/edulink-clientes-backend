import CostCenterHistory from "../models/costCenterHistory.mode.js";
import { timeZoneLima } from "../timezone.js";

export default class CostCenterHistoryService {
    async create(costCenterHistory){
        const {costumer_id, sale_id, cost_center_id, owner_id, action_by, action, state} = costCenterHistory;
        const newConstCenterHistory = CostCenterHistory.build({
            costumer_id,
            sale_id,
            cost_center_id,
            owner_id, 
            action_by,
            action,
            state,
            created_at:timeZoneLima()
        })
        const n_constCenterHistory = await newConstCenterHistory.save()
        return n_constCenterHistory
    }
}
