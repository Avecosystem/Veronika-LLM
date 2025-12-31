import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Update user credits
export const updateUserCredits = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { credits: Number(credits) }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating credits' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete related credit history first (optional, but good practice if cascade isn't set)
    await prisma.creditHistory.deleteMany({
      where: { userId: Number(id) }
    });

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
