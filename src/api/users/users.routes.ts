import express from 'express';
import * as userController from './controller';

const router = express.Router();

router.post('/create-user', userController.createUserController as express.RequestHandler);
router.get('/get-user/:email', userController.getUserByEmailController as express.RequestHandler);
router.post('/authenticate', userController.authenticateUserController as express.RequestHandler);
router.get('/get-users', userController.getAllUsersController as express.RequestHandler);
router.put('/update-user/:id', userController.updateUserController as express.RequestHandler);
router.delete('/delete-user/:id', userController.deleteUserController as express.RequestHandler);
router.get('/get-user-by-id/:id', userController.getUserByIdController as express.RequestHandler);
router.post('/discard-user/:id', userController.discardUserController as express.RequestHandler);
router.post('/is-new-contact-user/:id', userController.isNewUserController as express.RequestHandler);
router.post('/is-contact-user/:id', userController.isContactUserController as express.RequestHandler);

export default router;