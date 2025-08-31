import { Router } from 'express';
import { analyticsController } from '@/controllers/analyticsController';

const router = Router();

// Overall analytics
router.get('/dashboard', analyticsController.getDashboard);
router.get('/overview', analyticsController.getOverview);

// Cross-module insights
router.get('/correlations', analyticsController.getCorrelations);
router.get('/predictions', analyticsController.getPredictions);
router.get('/recommendations', analyticsController.getRecommendations);

export default router;
