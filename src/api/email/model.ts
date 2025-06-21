export interface EmailForm {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    bookDate?: Date;
    createdAt?: Date;
}