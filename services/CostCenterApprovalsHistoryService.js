import CostCenterApprovalsHistory from "../models/costCenterApprovalsHistory.js";
import { timeZoneLima } from "../timezone.js";

export default class CostCenterApprovalsHistoryService {
    async create(costCenterApprovals){
        const {costumer_id,sale_id,cost_center_id,owner_id,approved_by,state,commentary} = costCenterApprovals;

        const newConstCenterApprovalHistory = CostCenterApprovalsHistory.build({
            costumer_id,
            sale_id,
            cost_center_id,
            owner_id,
            approved_by,
            state,
            commentary,
            created_at:timeZoneLima()
        })

        const n_ccApprovalHistory = await newConstCenterApprovalHistory.save();
        return n_ccApprovalHistory
    }
};
