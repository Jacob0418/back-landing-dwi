import { EmailForm } from "./model";
import { connect, getMongoId } from "../../shared/database/mongodb";
import axios from "axios";
import Joi from "joi";

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
                secret: '6LdWnGwrAAAAAIg4ZXU2ern4J8zHuJ76_J4qxlsh',
                response: captchaToken,
            },
        });
        console.log(responseCaptcha.data);
        const successCaptcha = responseCaptcha.data.success;
        console.log('success', successCaptcha);
        if (!successCaptcha) {
            throw new Error("Captcha verification failed");
        }
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