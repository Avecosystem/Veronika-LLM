import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { isAdmin } from '../middleware/adminMiddleware';
import { getAllUsers, updateUserCredits, deleteUser } from '../controllers/adminController';

const router = express.Router();

// Apply auth and admin check to all routes
router.use(authenticateToken, isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/credits', updateUserCredits);
router.delete('/users/:id', deleteUser);

export default router;
