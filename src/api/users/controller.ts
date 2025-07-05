import { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail, authenticateUser, generateToken, getAllUsers, updateUser, getUserById, deleteUser,
    discardUser, setIsContactUser, setIsNewUser
 } from "./service";
import { userInfo } from "os";

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
        console.log('BODY:', req.body);
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);
        console.log("User authenticated:", user);
        if (!user) {
            return res.status(401).send({ status: "error", message: "Invalid email or password" });
        }
        const token = generateToken(user);

        res.status(200).send({ status: "success", data: { user, token } });
    } catch (error) {
        next(error);
    }
}

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await getAllUsers();
        res.status(200).send({ status: "success", data: users });
    } catch (error) {
        next(error);
    }
}

export async function updateUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const updatedUser = await updateUser(userId, userData);
        if (!updatedUser) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", data: updatedUser });
    } catch (error) {
        next(error);
    }
}

export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const result = await deleteUser(userId);
        if (!result) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export async function getUserByIdController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", data: user });
    } catch (error) {
        next(error);
    }
}

export async function discardUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const result = await discardUser(userId);
        if (!result) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", message: "User discarded successfully" });
    } catch (error) {
        next(error);
    }
}

export async function isNewUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const result = await setIsNewUser(userId);
        if (!result) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", message: "User isNew updated successfully" });
    } catch (error) {
        next(error);
    }
}

export async function isContactUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const result = await setIsContactUser(userId);
        if (!result) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "success", message: "User isContact updated successfully" });
    } catch (error) {
        next(error);
    }
}