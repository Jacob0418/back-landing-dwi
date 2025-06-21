import express, { NextFunction } from "express";
import { createEmail } from "./service";

export async function createEmailController(req: express.Request, res: express.Response, next: NextFunction) {
    try {
        const emailData = req.body;
        const email = await createEmail(emailData);
        res.status(201).send({ status: "success",message: "Todo Correcto!!!"  , data: email });
    } catch (error) {
        next(error);
    }
}
