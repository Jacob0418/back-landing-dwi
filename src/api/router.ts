import express from 'express';
import emailRoutes from './email/email.routes';
import userRoutes from './users/users.routes';

const router = express.Router();

router.use("/email", emailRoutes)
router.use("/users", userRoutes);

export { router };