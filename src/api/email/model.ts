import { ObjectId } from "mongodb";

export interface EmailForm {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    comentario: string;
    bookDate?: Date;
    token?: string;
    createdAt?: Date;
}