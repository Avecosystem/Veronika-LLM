import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Submit Payment Request (User)
export const createPaymentRequest = async (req: any, res: Response) => {
  try {
    const { amount, utr } = req.body;
    const userId = req.user.userId;

    if (!amount || !utr) {
      return res.status(400).json({ error: 'Amount and UTR are required' });
    }

    // Check if UTR already exists
    const existingPayment = await prisma.paymentRequest.findUnique({
      where: { utr }
    });

    if (existingPayment) {
      return res.status(400).json({ error: 'UTR already submitted' });
    }

    const payment = await prisma.paymentRequest.create({
      data: {
        userId,
        amount: Number(amount),
        utr,
        status: 'PENDING'
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting payment request' });
  }
};

// Get User's Payment History (User)
export const getUserPayments = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const payments = await prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

// Get All Pending Payments (Admin)
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.paymentRequest.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending payments' });
  }
};

// Approve/Reject Payment (Admin)
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payment = await prisma.paymentRequest.findUnique({
      where: { id: id }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    if (payment.status !== 'PENDING') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      // Update payment status
      await prisma.paymentRequest.update({
        where: { id: id },
        data: { status }
      });

      // If approved, add credits to user
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: payment.userId },
          data: { credits: { increment: payment.amount } }
        });

        await prisma.creditHistory.create({
          data: {
            userId: payment.userId,
            amount: payment.amount,
            reason: `Payment Approved (UTR: ${payment.utr})`
          }
        });
      }
    });

    res.json({ message: `Payment ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
};
