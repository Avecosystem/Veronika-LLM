import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking admin status' });
  }
};
