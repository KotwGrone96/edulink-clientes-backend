import LogisticTasks from "../models/logisticTask.model.js";
import Costumer from "../models/costumer.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";
import LogisticTaskFile from "../models/logisticTaskFile.model.js";
import ProductByLogisticTask from "../models/productByLogisticTask.model.js";

export default class LogisticTaskService {
    
    async create(logisticTask){
        const { 
            costumer_id,
            sale_id,
            cost_center_id,
            name,
            description,
            state,
            execution_date,
            success_date,
            created_by,
            designated_user,
            commentary
        } = logisticTask;

        const newLogisticTask = LogisticTasks.build({
            costumer_id,
            sale_id,
            cost_center_id,
            name,
            description,
            state,
            execution_date,
            success_date,
            created_by,
            designated_user,
            commentary,
            created_at:timeZoneLima(),
            updated_at:timeZoneLima()
        })

        const n_logistiTask = await newLogisticTask.save()

        return n_logistiTask
    }

    async update(logisticTask,where){
        const { 
            costumer_id,
            sale_id,
            cost_center_id,
            name,
            description,
            state,
            execution_date,
            success_date,
            created_by,
            designated_user,
            commentary
        } = logisticTask;

        const updtLogisticTask = await LogisticTasks.update({
            costumer_id,
            sale_id,
            cost_center_id,
            name,
            description,
            state,
            execution_date,
            success_date,
            created_by,
            designated_user,
            commentary,
            updated_at:timeZoneLima()
        },{ where })

        return updtLogisticTask;
    }

    async findAll(where,attributes,limit=undefined,offset=undefined){
        const logisticTasks = await LogisticTasks.findAll({
            where,
            attributes,
            limit,
            offset,
			order:[['created_at','DESC']],
            include:[
                {
                    model:User,
                    as:"CreatedBy"
                },
                {
                    model:User,
                    as:"DesignatedUser"
                },
                {
                    model:Costumer
                },
                {
                    model:LogisticTaskFile
                }
            ]
        })

        return logisticTasks
    }

    async findOne(where,attributes){
        const logisticTask = await LogisticTasks.findOne({
            where,
            attributes,
            include:[
                {
                    model:User
                },
                {
                    model:Costumer
                }
            ]
        })

        return logisticTask
    }

    async delete(id){
        const delLogisticTask = await LogisticTasks.update({
            deleted_at:timeZoneLima()
        },{ where: {id} })
        return delLogisticTask
    } 

    async countAll(where){
        const logisticTasks = await LogisticTasks.count({where})
        return logisticTasks;
    }

    async createLogisticTaskFile(logisticTaskFile){
        const {logistic_task_id, filename} = logisticTaskFile;
        const newLogisticTaskFile = LogisticTaskFile.build({
            logistic_task_id,
            filename
        })

        const n_logisticTaskFile = await newLogisticTaskFile.save()
        return n_logisticTaskFile
    }

    async createProductByLogisticTask(productByLogisticTask){
        const { logistic_task_id, product_selled_id } = productByLogisticTask
        const newProductByLogisticTask = ProductByLogisticTask.build({
            logistic_task_id,
            product_selled_id
        })
        const n_productByLogisticTask = await newProductByLogisticTask.save()
        return n_productByLogisticTask
    }

    async deleteProductByLogisticTask(where){
        const delProductByLogisticTask = ProductByLogisticTask.destroy({where})
        return delProductByLogisticTask
    }
};
