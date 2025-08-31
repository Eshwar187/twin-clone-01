import { Router } from 'express';
import { budgetController } from '@/controllers/budgetController';
import { validateRequest } from '@/middleware/validation';
import { budgetValidation } from '@/validations/budgetValidation';

const router = Router();

// Budget overview
router.get('/dashboard', budgetController.getDashboard);
router.get('/summary', budgetController.getBudgetSummary);

// Categories management
router.get('/categories', budgetController.getCategories);
router.post('/categories', validateRequest(budgetValidation.createCategory), budgetController.createCategory);
router.patch('/categories/:id', validateRequest(budgetValidation.updateCategory), budgetController.updateCategory);
router.delete('/categories/:id', budgetController.deleteCategory);

// Expenses management
router.get('/expenses', budgetController.getExpenses);
router.post('/expenses', validateRequest(budgetValidation.createExpense), budgetController.createExpense);
router.patch('/expenses/:id', validateRequest(budgetValidation.updateExpense), budgetController.updateExpense);
router.delete('/expenses/:id', budgetController.deleteExpense);

// Analytics and insights
router.get('/analytics', budgetController.getAnalytics);
router.get('/insights', budgetController.getAIInsights);
router.get('/trends', budgetController.getTrends);
router.get('/reports', budgetController.getReports);

export default router;
