import { Router } from 'express';
import { avatarController } from '@/controllers/avatarController';

const router = Router();

// Avatar state management
router.get('/state', avatarController.getCurrentState);
router.get('/history', avatarController.getStateHistory);
router.post('/update', avatarController.updateState);

// Avatar insights
router.get('/insights', avatarController.getInsights);
router.post('/insights/:id/read', avatarController.markInsightAsRead);

// Avatar analytics
router.get('/analytics', avatarController.getAnalytics);

export default router;
