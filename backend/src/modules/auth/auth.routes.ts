import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register',         authController.register);
router.post('/login',            authController.login);
router.post('/forgot-password',  authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/change-password',  protect, authController.changePassword);

export default router;