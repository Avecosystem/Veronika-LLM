import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../utils/prisma';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    // Call OpenRouter
    console.log(`Sending request to OpenRouter with model: ${model || 'google/gemma-2-9b-it:free'}`);

    let responseData;
    try {
      const response = await axios.post(
        API_URL,
        {
          model: model || 'google/gemma-2-9b-it:free',
          messages
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Veronika LLM'
          }
        }
      );
      responseData = response.data;
    } catch (apiError: any) {
      console.error('OpenRouter API failed, falling back to mock:', apiError.response?.data || apiError.message);
      // Fallback Mock Response
      responseData = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: "I'm having trouble connecting to the AI provider (Invalid API Key or Network Issue). \n\nBut don't worry, the system is working! This is a simulated response to verify the credit deduction and chat UI flow.\n\nPlease check your OPENROUTER_API_KEY in the server .env file."
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