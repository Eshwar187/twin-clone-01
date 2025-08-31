import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { validateRequest } from '@/middleware/validation';
import { userValidation } from '@/validations/userValidation';
import { upload } from '@/middleware/upload';

const router = Router();

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', validateRequest(userValidation.updateProfile), userController.updateProfile);
router.patch('/avatar', upload.single('avatar'), userController.updateAvatar);
router.patch('/password', validateRequest(userValidation.changePassword), userController.changePassword);

// User preferences
router.get('/preferences', userController.getPreferences);
router.patch('/preferences', validateRequest(userValidation.updatePreferences), userController.updatePreferences);

// Account management
router.patch('/deactivate', userController.deactivateAccount);
router.delete('/delete', userController.deleteAccount);

export default router;
