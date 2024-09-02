import LogisticTasks from "../models/logisticTask.model.js";
import Costumer from "../models/costumer.model.js";
import User from "../models/user.model.js";
import { timeZoneLima } from "../timezone.js";

export default class LogisticTaskService {
    
    async create(logisticTask){
        const { 
            costumer_id,
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

    async findAll(where,attributes){
        const logisticTasks = await LogisticTasks.findAll({
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
};
