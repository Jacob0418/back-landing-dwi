import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId | string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "user";
    createdAt?: Date;
    isDeleted?: boolean;
    token?: string;
    isNew?: boolean;
    isContact?: boolean;
    isDiscard?: boolean;
}