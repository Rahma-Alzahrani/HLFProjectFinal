import { EmailPayload } from "emailpayload.types";
import handlebar from "handlebars";
import mongoose from "mongoose";
import * as nodemailer from "nodemailer";
import { emailTemplates, SMTP_HOST, SMTP_PASSWORD, SMTP_USER } from "./secrets";

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 2525,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    },
    logger: true
});


export const sendMail = async (payload: EmailPayload) => {
    try {

        const emailTemplateCollection = await mongoose.connection.db.collection("emailTemplate");
        const emailTemplate = await emailTemplateCollection.findOne({ "emailType": payload.emailType });


        const subject = emailTemplate.subject;
        const html = handlebar.compile(emailTemplate.html);



        const mailOptions = {
            from: "\"DataManagement Team\" <admin@datamanagement.com>",
            to: payload.to,
            subject,
            html: html(payload.payload)
        };

        await transporter.sendMail(mailOptions);
        return true;

    } catch (error) {
        return false;
    }
};


export const insertEmailTemplates = async () => {

    const res = (await (await mongoose.connection.db.listCollections().toArray()).findIndex((item) => item.name === "emailTemplate") !== -1);
    console.log(res);
    if (!res) {
        await mongoose.connection.db.collection("emailTemplate").insertMany(emailTemplates);
    }
};