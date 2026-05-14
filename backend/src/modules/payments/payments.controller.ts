import { Request, Response } from 'express';
import * as paymentsService from './payments.service';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400).json({ message: 'BookingId is required' });
      return;
    }
    const order = await paymentsService.createOrder(bookingId);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({ message: 'All payment fields are required' });
      return;
    }
    const payment = await paymentsService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    res.status(200).json(payment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPaymentByBooking = async (req: Request, res: Response) => {
  try {
    const payment = await paymentsService.getPaymentByBooking(
      req.params['bookingId'] as string
    );
    res.status(200).json(payment);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};