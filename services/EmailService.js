import Email from "../models/email.model.js";
import User from "../models/user.model.js";

export default class EmailService {
    async findAll(where){
        const emails = await Email.findAll({
            where,
            include:[
                {
                    model:User
                }
            ]
        })
        return emails
    }

    async create(emailBody){
        const {email,subject,user_id} = emailBody;
        const newEmail = Email.build({
            email,
            subject,
            user_id
        })
        const n_email = await newEmail.save()
        return n_email
    }
};
