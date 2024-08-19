import Finance from "../models/finance.model.js";
import FinanceSection from "../models/financeSection.model.js";

export default class FinanceSectionService {
    
    async create(financeSection){
        const { name } = financeSection;

        const newFinanceSection = FinanceSection.build({
            name
        })
        const n_financeSection = await newFinanceSection.save()
        return n_financeSection
    }

    async update(financeSection, where){
        const { name } = financeSection;

        const updtFinanceSection = await FinanceSection.update({
            name
        },{ where })

        return updtFinanceSection
    }

    async findAll(){
        const financeSections = await FinanceSection.findAll({
            include:[
                {
                    model:Finance
                }
            ]
        })
        return financeSections
    }

    async findOne(where){
        const financeSection = await FinanceSection.findOne({
            where,
            include:[
                {
                    model:Finance
                }
            ]
        })
        return financeSection
    }

    async delete(where){
        const delFinanceSection = await FinanceSection.destroy({where})
        return delFinanceSection
    }

};
