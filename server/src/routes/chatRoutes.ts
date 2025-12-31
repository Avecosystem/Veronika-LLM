import express from 'express';
import { chat } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, chat);

export default router;