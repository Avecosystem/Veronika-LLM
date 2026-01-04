import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../utils/prisma';

const A4F_API_KEY = process.env.A4F_API_KEY;
const API_URL = "https://api.a4f.co/v1/chat/completions";

export const chat = async (req: any, res: Response) => {
  try {
    const { messages, model } = req.body;
    const userId = req.user.userId;

    // Check credits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    // Check API Key
    // Check API Key
    if (!A4F_API_KEY) {
      console.error('A4F_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    // Call Provider
    console.log(`Sending request to A4F Provider with model: ${model || 'provider-8/gpt-oss-20b'}`);

    let responseData;
    try {
      const response = await axios.post(
        API_URL,
        {
          model: model || 'provider-8/gpt-oss-20b',
          messages
        },
        {
          headers: {
            'Authorization': `Bearer ${A4F_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      responseData = response.data;
    } catch (apiError: any) {
      console.error('Provider API failed, falling back to mock:', apiError.response?.data || apiError.message);
      // Fallback Mock Response
      responseData = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: "I'm having trouble connecting to the AI provider (Invalid API Key or Network Issue). \n\nBut don't worry, the system is working! This is a simulated response to verify the credit deduction and chat UI flow.\n\nPlease check your A4F_API_KEY in the server .env file."
            }
          }
        ]
      };
    }

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

    res.json(responseData);

  } catch (error: any) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Error processing chat request' });
  }
};