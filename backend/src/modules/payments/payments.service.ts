import crypto from 'crypto';
import prisma from '../../utils/prisma';
import { razorpay } from '../../utils/razorpay';
import { createNotification } from '../notifications/notifications.service';

export const createOrder = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking not found');

  const existing = await prisma.payment.findUnique({ where: { bookingId } });
  if (existing && existing.status === 'SUCCESS') throw new Error('Already paid');

  const order = await razorpay.orders.create({
    amount: Math.round(booking.totalAmount * 100),
    currency: 'INR',
    receipt: bookingId,
  });

  if (!existing) {
    await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalAmount,
        razorpayOrderId: order.id,
      },
    });
  } else {
    await prisma.payment.update({
      where: { bookingId },
      data: { razorpayOrderId: order.id },
    });
  }

  return order;
};

export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(body)
    .digest('hex');

  if (expected !== razorpaySignature) throw new Error('Payment verification failed');

  // Find payment by razorpayOrderId first
  const existingPayment = await prisma.payment.findFirst({
    where: { razorpayOrderId },
  });
  if (!existingPayment) throw new Error('Payment record not found');

  const payment = await prisma.payment.update({
    where: { id: existingPayment.id },
    data: {
      razorpayPaymentId,
      razorpaySignature,
      status: 'SUCCESS',
      paidAt: new Date(),
    },
  });

  const booking = await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { status: 'CONFIRMED' },
  });

  await createNotification({
    userId: booking.userId,
    type: 'PAYMENT_SUCCESS',
    title: 'Payment Successful',
    message: `Payment of ₹${payment.amount} received. Your booking is confirmed.`,
  });

  await createNotification({
    providerId: booking.providerId,
    type: 'PAYMENT_SUCCESS',
    title: 'Payment Received',
    message: `Payment of ₹${payment.amount} received for your booking.`,
  });

  return payment;
};

export const getPaymentByBooking = async (bookingId: string) => {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment) throw new Error('Payment not found');
  return payment;
};