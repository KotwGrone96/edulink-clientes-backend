import CostCenter from "../models/costCenter.model.js";
import ProductSelled from "../models/productSelled.model.js";
import Costumer from '../models/costumer.model.js'
import Sale from "../models/sale.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";
import CostCenterApprovals from "../models/costCenterApprovals.model.js";
import Invoice from "../models/invoice.model.js";
import Payment from '../models/payment.model.js'
import CostCenterTaskItem from "../models/costCenterTaskItem.js";
import CostCenterTaskUserItem from "../models/costCenterTaskUserItem.js";
import CostCenterTasks from "../models/costCenterTasks.js";
import CostCenterProcess from "../models/costCenterProcess.model.js";

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
            name,
            phone,
            email,
            destiny_person,
            destiny_address,
            commentary,
            email_thread_id,
            email_subject,
            ammountHidden,
            ammountWithOutTaxes,
            ammountTaxes,
            ammountTotal,
            netMargin,
            invoice_email,
            invoice_manager,
            biller_email,
            biller_manager,
            tasks,
            payments_months
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
            phone,
            email,
            destiny_person,
            destiny_address,
            commentary,
            email_thread_id,
            email_subject,
            ammountHidden,
            ammountWithOutTaxes,
            ammountTaxes,
            ammountTotal,
            netMargin,
            invoice_email,
            invoice_manager,
            biller_email,
            biller_manager,
            tasks,
            payments_months,
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
            name,
            phone,
            email,
            destiny_person,
            destiny_address,
            commentary,
            email_thread_id,
            email_subject,
            ammountHidden,
            ammountWithOutTaxes,
            ammountTaxes,
            ammountTotal,
            netMargin,
            invoice_email,
            invoice_manager,
            biller_email,
            biller_manager,
            tasks,
            payments_months
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
            phone,
            email,
            destiny_person,
            destiny_address,
            commentary,
            email_thread_id,
            email_subject,
            ammountHidden,
            ammountWithOutTaxes,
            ammountTaxes,
            ammountTotal,
            netMargin,
            invoice_email,
            invoice_manager,
            biller_email,
            biller_manager,
            tasks,
            payments_months,
            updated_at:timeZoneLima()
        },{ where })
        
        return updt_costCenter;
    }

    async findAll(where,attributes,limit=undefined,offset=undefined){
        const costsCenters = await CostCenter.findAll({ where,
            attributes,
            limit,
            offset,
            include:[
                {
                    model:User,

                },
                {
                    model:Sale,
                },
                {
                    model:ProductSelled,
                    where:{ deleted_at:null },
                    required:false
                },

                {
                    model:Costumer
                },
                {
                    model:CostCenterApprovals,
                    include:[
                        {
                            model:User
                        }
                    ]
                },
                {
                    model:Invoice,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:Payment,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:CostCenterTasks
                },{
                    model:CostCenterProcess,
                    as: 'CostCenterProcesses'
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
                    model:ProductSelled,
                    where:{deleted_at:null},
                    required:false
                },
                {
                    model:Costumer
                },
                {
                    model:CostCenterApprovals
                },
                {
                    model:CostCenterTasks
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

    async countAll(where){
        const costCenters = await CostCenter.count({where})
        return costCenters;
    }

    async createTaskItem(taskItem){
        const { name } = taskItem
        const newTaskItem = CostCenterTaskItem.build({
            name
        })
        const n_taskItem = await newTaskItem.save()
        return n_taskItem
    }

    async updateTaskItem(taskItem,where){
        const { name } = taskItem
        const updtTaskItem = await CostCenterTaskItem.update({
            name
        },{where})
        return updtTaskItem
    }

    async findAllTaskItem(where,attributes){
        const costCenterTaskItems = await CostCenterTaskItem.findAll({
            where,
            attributes,
            include:[
                {
                    model:CostCenterTaskUserItem,
                    include:[
                        {
                            model:User
                        }
                    ]
                },
                {
                    model:CostCenterTasks
                }
            ]
        })
        return costCenterTaskItems
    }

    async deleteTaskItem(id){
        const delTaskItem = await CostCenterTaskItem.destroy({where:{id}})
        return delTaskItem
    }

    async createTaskUserItem(taskUserItem){
        const { index, name, user_id, cost_center_task_item_id } = taskUserItem
        const newTaskUserItem = CostCenterTaskUserItem.build({
            index,
            name,
            user_id,
            cost_center_task_item_id
        })
        const n_taskUserItem = await newTaskUserItem.save()
        return n_taskUserItem
    }

    async updateTaskUserItem(taskUserItem,where){
        const { index, name, user_id, cost_center_task_item_id } = taskUserItem
        const updtTaskUserItem = await CostCenterTaskUserItem.update({
            index,
            name,
            user_id,
            cost_center_task_item_id
        },{where})
        
        return updtTaskUserItem
    }

    async deleteTaskUserItem(id){
        const delTaskItem = await CostCenterTaskUserItem.destroy({where:{id}})
        return delTaskItem
    }

    async deleteMultipleTaskUserItem(where){
        const delTaskItem = await CostCenterTaskUserItem.destroy({where})
        return delTaskItem
    }

    async createCostCenterTask(costCenterTask){
        const { cost_center_id, cost_center_task_item_id } = costCenterTask
        const newCostCenterTaskI = CostCenterTasks.build({
            cost_center_id, 
            cost_center_task_item_id
        })
        const n_costCentertask = await newCostCenterTaskI.save()
        return n_costCentertask
    }

    async deleteCostCenterTask(where){
        const delCostCenterTask = await CostCenterTasks.destroy({where})
        return delCostCenterTask
    }

    async createCostCenterProcess(costCenterProcess){
        const {
            costumer_id,
            sale_id,
            cost_center_id,
            cost_center_task_item_id,
        } = costCenterProcess;

        const time = timeZoneLima()

        const newCostCenterProcess = CostCenterProcess.build({
            costumer_id,
            sale_id,
            cost_center_id,
            cost_center_task_item_id,
            created_at:time,
            updated_at:time
        })

        const n_costCenterProcess = await newCostCenterProcess.save()
        return n_costCenterProcess
    }

    async findAllCostCenterProcess(where){
        const costCenterProcesses = await CostCenterProcess.findAll({
            where,
            include:[
                {
                    model:Costumer
                },{
                    model:CostCenter
                },
                {
                    model:Sale
                },
                {
                    model:CostCenterTaskItem,
                    include:[
                        {
                            model:CostCenterTaskUserItem,
                            include:[
                                {
                                    model:User
                                }
                            ]
                        }
                    ]
                },
            ]
        });
        return costCenterProcesses
    }
}