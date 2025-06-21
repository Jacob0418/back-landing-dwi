import express from 'express';
import emailRoutes from './email/email.routes';

const router = express.Router();

router.use("/email", emailRoutes)

export { router };