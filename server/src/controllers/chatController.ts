import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../utils/prisma';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const chat = async (req: any, res: Response) => {
  try {
    const { messages, model } = req.body;
    const userId = req.user.userId;

    // Check credits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    // Call OpenRouter
    const response = await axios.post(
      API_URL,
      {
        model: model || 'provider-8/gpt-oss-20b',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', 
        }
      }
    );

    // Deduct credit
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      }),
      prisma.creditHistory.create({
        data: {
          userId,
          amount: -1,
          reason: 'Chat generation'
        }
      })
    ]);

    res.json(response.data);

  } catch (error: any) {
    console.error('Chat error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error generating response' });
  }
};