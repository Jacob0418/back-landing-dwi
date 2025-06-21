import { EmailForm } from "./model";
import { connect, getMongoId } from "../../shared/database/mongodb";

export async function createEmail(email: EmailForm): Promise<EmailForm> {
    try {
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