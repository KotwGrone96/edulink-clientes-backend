import Payment from "../models/payment.model.js";
import { timeZoneLima } from "../timezone.js";

export default class PaymentService {
    
    async create(payment) {
        const {
            costumer_id,
            sale_id,
            cost_center_id,
            ammount,
            currency,
            payment_date,
            filename
        } =  payment

        const time = timeZoneLima()

        const newPayment = Payment.build({
            costumer_id,
            sale_id,
            cost_center_id,
            ammount,
            currency,
            payment_date,
            filename,
            created_at:time,
            updated_at:time
        })

        const n_payment = newPayment.save()
        return n_payment
    }

    async update(payment,where) {
        const {
            costumer_id,
            sale_id,
            cost_center_id,
            ammount,
            currency,
            payment_date,
            filename
        } =  payment

        const updtPayment = Payment.update({
            costumer_id,
            sale_id,
            cost_center_id,
            ammount,
            currency,
            payment_date,
            filename,
            updated_at:timeZoneLima()
        },{where})

        const updt_payment = updtPayment.save()
        return updt_payment
    }

    async findAll(where,attributes){
        const payments = await Payment.findAll({
            where,
            attributes
        });

        return payments
    }

    async findOne(where,attributes){
        const payment = await Payment.findOne({
            where,
            attributes
        });

        return payment
    }

    async delete(id){
        const updt_payment = await Payment.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });
        return updt_payment;
    }

};
