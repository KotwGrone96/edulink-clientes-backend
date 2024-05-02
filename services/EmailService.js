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
};
