import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { isAdmin } from '../middleware/adminMiddleware';
import { 
  createPaymentRequest, 
  getUserPayments, 
  getPendingPayments, 
  updatePaymentStatus 
} from '../controllers/paymentController';

const router = express.Router();

// User routes
router.post('/request', authenticateToken, createPaymentRequest);
router.get('/history', authenticateToken, getUserPayments);

// Admin routes
router.get('/pending', authenticateToken, isAdmin, getPendingPayments);
router.put('/:id/status', authenticateToken, isAdmin, updatePaymentStatus);

export default router;
