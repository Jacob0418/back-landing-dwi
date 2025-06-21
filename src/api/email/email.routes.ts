import express from 'express';
import * as createEmailController from './controller';

const router = express.Router();

router.post('/create-email', createEmailController.createEmailController);

export default router;