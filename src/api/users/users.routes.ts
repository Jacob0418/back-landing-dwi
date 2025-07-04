import express from 'express';
import * as userController from './controller';

const router = express.Router();

router.post('/create-user', userController.createUserController as express.RequestHandler);
router.get('/get-user/:email', userController.getUserByEmailController as express.RequestHandler);
router.post('/authenticate', userController.authenticateUserController as express.RequestHandler);

export default router;