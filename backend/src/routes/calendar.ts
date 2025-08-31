import { Router } from 'express';
import { calendarController } from '@/controllers/calendarController';
import { validateRequest } from '@/middleware/validation';
import { calendarValidation } from '@/validations/calendarValidation';

const router = Router();

// Calendar overview
router.get('/dashboard', calendarController.getDashboard);

// Events management
router.get('/events', calendarController.getEvents);
router.post('/events', validateRequest(calendarValidation.createEvent), calendarController.createEvent);
router.get('/events/:id', calendarController.getEvent);
router.patch('/events/:id', validateRequest(calendarValidation.updateEvent), calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

// Tasks management
router.get('/tasks', calendarController.getTasks);
router.post('/tasks', validateRequest(calendarValidation.createTask), calendarController.createTask);
router.patch('/tasks/:id', validateRequest(calendarValidation.updateTask), calendarController.updateTask);
router.delete('/tasks/:id', calendarController.deleteTask);
router.post('/tasks/:id/complete', calendarController.completeTask);

// Productivity analytics
router.get('/productivity', calendarController.getProductivityStats);
router.get('/time-tracking', calendarController.getTimeTracking);

export default router;
