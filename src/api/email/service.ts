import { EmailForm } from "./model";
import { connect, getMongoId } from "../../shared/database/mongodb";
import axios from "axios";
import Joi from "joi";
import SibApiV3Sdk from 'sib-api-v3-sdk';

const emailSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    date: Joi.string().required(),
    comentario: Joi.string().required(),
    "g-recaptcha-response": Joi.string().required(),
});

export async function createEmail(email: EmailForm & { "g-recaptcha-response": string }): Promise<EmailForm> {
    try {
        const { error } = emailSchema.validate(email);
        if (error) {
            throw new Error("Datos inválidos: " + error.details[0].message);
        }

        const captchaToken = email["g-recaptcha-response"];
        if (!captchaToken) {
            throw new Error("Captcha token missing");
        }

        const responseCaptcha = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY as string,
                response: captchaToken,
            },
        });
        console.log(responseCaptcha.data);
        const successCaptcha = responseCaptcha.data.success;
        console.log('success', successCaptcha);
        if (!successCaptcha) {
            throw new Error("Captcha verification failed");
        }
        await sendEmail(email);
        const db = await connect();
        const collection = db.collection<EmailForm>("emails");
        const result = await collection.insertOne({
            ...email,
            createdAt: new Date(),
        });
        return { ...email, _id: result.insertedId.toString(), createdAt: new Date() };
    } catch (error) {
        throw error;
    }
}

export async function sendEmail(email: EmailForm): Promise<void> {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        console.log("API Key:", apiKey.apiKey);

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = { email: "info.cm@landingcrm.store", name: "Info CarManage" };
        sendSmtpEmail.to = [{ email: email.email, name: email.name }];
        sendSmtpEmail.subject = "Formulario de Contacto - Lead";
        sendSmtpEmail.templateId = 1;
        const params = sendSmtpEmail.params = {
            name: email.name,
            email: email.email,
            phone: email.phone,
            message: email.comentario,
        };
        console.log(params)
        const brevoResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", brevoResponse);

        if (brevoResponse.messageId) {
            console.log("Email enviado exitosamente!");
        } else {
            console.log("Ocurrió un error al enviar el email.");
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
}