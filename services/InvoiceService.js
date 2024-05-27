import Invoice from "../models/invoice.model.js";
import { timeZoneLima } from "../timezone.js";

export default class InvoiceService {
    
    async create(invoice){
        const {
            name,
            filename,
            invoice_date,
            cost_center_id,
            sale_id,
            costumer_id
        } = invoice;

        const newInvoice = Invoice.build({
            name,
            filename,
            invoice_date,
            cost_center_id,
            sale_id,
            costumer_id,
            created_at:timeZoneLima()
        });

        const n_invoice = await newInvoice.save();
        return n_invoice;
    }

    async update(invoice,where){
        const {
            name,
            filename,
            invoice_date,
            is_paid,
            paid_date,
            cost_center_id,
            sale_id,
            costumer_id
        } = invoice;

        const updt_invoice = await Invoice.update({
            name,
            filename,
            invoice_date,
            is_paid,
            paid_date,
            cost_center_id,
            sale_id,
            costumer_id,
            updated_at:timeZoneLima()
        },{where});

        return updt_invoice
    }

    async findAll(where,attributes){
        const invoices = await Invoice.findAll({
            where,
            attributes
        });

        return invoices
    }

    async findOne(where,attributes){
        const invoice = await Invoice.findOne({
            where,
            attributes
        });

        return invoice
    }

    async delete(id){
        const updt_invoice = await Invoice.update({
            deleted_at:timeZoneLima()
        },{ where:{ id } });
        return updt_invoice;
    }
};
