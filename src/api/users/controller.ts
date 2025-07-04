import { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail, authenticateUser, generateToken } from "./service";

export async function createUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req.body;
        const user = await createUser(userData);
        res.status(201).send({ status: "success", message: "User created successfully", data: user });
    } catch (error) {
        next(error);
    }
}

export async function getUserByEmailController(req: Request, res: Response, next: NextFunction) {
    try {
        const email = req.params.email;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", data: user });
    } catch (error) {
        next(error);
    }
}

export async function authenticateUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);
        if (!user) {
            return res.status(401).send({ status: "error", message: "Invalid email or password" });
        }
        const token = generateToken(user);

        res.status(200).send({ status: "success", data: { user, token } });
    } catch (error) {
        next(error);
    }
}