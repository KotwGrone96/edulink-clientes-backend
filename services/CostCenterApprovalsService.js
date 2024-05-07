import CostCenterApprovals from "../models/costCenterApprovals.model.js";
import { timeZoneLima } from "../timezone.js";

export default class CostCenterApprovalsService {
    
    async create(costCenterApproval){
        const {cost_center_id, state, body} = costCenterApproval;
        const ccApproval = CostCenterApprovals.build({
            cost_center_id,
            state,
            body,
            approved_by,
            created_at:timeZoneLima()
        })
        const new_ccApproval = await ccApproval.save()
        return new_ccApproval
    }

    async update(costCenterApproval,where){
        const {cost_center_id, state, body,approved_by} = costCenterApproval;
        const ccApproval = await CostCenterApprovals.update({
            cost_center_id,
            state,
            body,
            approved_by,
            updated_at:timeZoneLima()
            },
            {where}
        ) 
        return ccApproval
    }

    async updateOrCreate(costCenterApproval){
        const {cost_center_id, state, body,approved_by} = costCenterApproval;
        const exist = await CostCenterApprovals.findOne({
            where:{ deleted_at:null, cost_center_id }
        });
        if(exist){
            await exist.update({
                state,
                body,
                approved_by
            })
            return exist
        }
        const new_ccApproval = await this.create(costCenterApproval);
        return new_ccApproval
    }
};
