import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { validateRequest } from '@/middleware/validation';
import { authValidation } from '@/validations/authValidation';

const router = Router();

// Authentication routes
router.post('/register', validateRequest(authValidation.register), authController.register);
router.post('/login', validateRequest(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', validateRequest(authValidation.refreshToken), authController.refreshToken);

// Password management
router.post('/forgot-password', validateRequest(authValidation.forgotPassword), authController.forgotPassword);
router.patch('/reset-password/:token', validateRequest(authValidation.resetPassword), authController.resetPassword);

// Email verification
router.post('/send-verification', authController.sendEmailVerification);
router.patch('/verify-email/:token', authController.verifyEmail);

export default router;
