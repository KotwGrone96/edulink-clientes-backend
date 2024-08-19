import Finance from "../models/finance.model.js";
import FinanceSection from "../models/financeSection.model.js";
export default class FinanceService{

    async create(finance){
        const {
            name,
            costumer_id,
            filename,
            finance_section_id
        } = finance;

        const newFinance = Finance.build({
            name,
            costumer_id,
            filename,
            finance_section_id
        })

        const n_finance = await newFinance.save()
        return n_finance
    }

    async update(finance,where){
        const {
            name,
            costumer_id,
            filename,
            finance_section_id
        } = finance;

        const updtFinance = await Finance.update({
            name,
            costumer_id,
            filename,
            finance_section_id
        },{where})

        return updtFinance
    }

    async delete(where){
        const delFinance = await Finance.destroy({where})
        return delFinance
    }

    async findAll(where){
        const finances = await Finance.findAll({
            where,
            include:[
                {
                    model:FinanceSection
                }
            ]
        })

        return finances
    }

    async findOne(where){
        const finance = await Finance.findOne({
            where,
            include:[
                {
                    model:FinanceSection
                }
            ]
        })

        return finance
    }
}
