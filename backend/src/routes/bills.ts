import { Router } from 'express';
import { billsController } from '@/controllers/billsController';
import { validateRequest } from '@/middleware/validation';
import { billsValidation } from '@/validations/billsValidation';

const router = Router();

// Bills dashboard
router.get('/dashboard', billsController.getDashboard);

// Groups management
router.get('/groups', billsController.getGroups);
router.post('/groups', validateRequest(billsValidation.createGroup), billsController.createGroup);
router.patch('/groups/:id', validateRequest(billsValidation.updateGroup), billsController.updateGroup);
router.delete('/groups/:id', billsController.deleteGroup);
router.post('/groups/:id/join', billsController.joinGroup);
router.post('/groups/:id/leave', billsController.leaveGroup);
router.get('/groups/:id/members', billsController.getGroupMembers);

// Bills management
router.get('/bills', billsController.getBills);
router.post('/bills', validateRequest(billsValidation.createBill), billsController.createBill);
router.patch('/bills/:id', validateRequest(billsValidation.updateBill), billsController.updateBill);
router.delete('/bills/:id', billsController.deleteBill);
router.post('/bills/:id/settle', billsController.settleBill);

// Settlements
router.get('/settlements', billsController.getSettlements);
router.post('/settlements/:id/pay', billsController.paySettlement);
router.post('/settlements/:id/confirm', billsController.confirmPayment);

// QR Code generation for payments
router.get('/bills/:id/qr', billsController.generateQRCode);

export default router;
