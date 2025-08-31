import { Router } from 'express';
import { healthController } from '@/controllers/healthController';
import { validateRequest } from '@/middleware/validation';
import { healthValidation } from '@/validations/healthValidation';

const router = Router();

// Health data routes
router.get('/dashboard', healthController.getDashboard);
router.get('/data', healthController.getHealthData);
router.post('/data', validateRequest(healthValidation.createHealthData), healthController.createHealthData);
router.patch('/data/:date', validateRequest(healthValidation.updateHealthData), healthController.updateHealthData);

// Water tracking
router.post('/water', validateRequest(healthValidation.logWater), healthController.logWater);
router.get('/water/stats', healthController.getWaterStats);

// Sleep tracking
router.post('/sleep', validateRequest(healthValidation.logSleep), healthController.logSleep);
router.get('/sleep/stats', healthController.getSleepStats);

// Exercise tracking
router.post('/exercise', validateRequest(healthValidation.logExercise), healthController.logExercise);
router.get('/exercise/stats', healthController.getExerciseStats);

// Habits management
router.get('/habits', healthController.getHabits);
router.post('/habits', validateRequest(healthValidation.createHabit), healthController.createHabit);
router.patch('/habits/:id', validateRequest(healthValidation.updateHabit), healthController.updateHabit);
router.delete('/habits/:id', healthController.deleteHabit);
router.post('/habits/:id/complete', healthController.completeHabit);

// Analytics and insights
router.get('/analytics', healthController.getAnalytics);
router.get('/trends', healthController.getTrends);

export default router;
