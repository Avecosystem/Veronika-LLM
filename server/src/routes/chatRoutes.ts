import express from 'express';
import { chat } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, chat);

export default router;