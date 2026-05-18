import prisma from '../../utils/prisma';
import { createNotification } from '../notifications/notifications.service';

export const createBooking = async (data: any) => {
  const { userId, providerId, serviceId, scheduledAt, address, totalAmount } = data;

  const booking = await prisma.booking.create({
    data: { userId, providerId, serviceId, scheduledAt, address, totalAmount },
    include: { user: true, provider: true, service: true },
  });

  await createNotification({
    userId: booking.userId,
    type: 'BOOKING_CREATED',
    title: 'Booking Placed',
    message: `Your booking for ${booking.service.name} has been placed successfully.`,
  });

  await createNotification({
    providerId: booking.providerId,
    type: 'BOOKING_CREATED',
    title: 'New Booking Request',
    message: `You have a new booking request for ${booking.service.name}.`,
  });

  return booking;
};

export const getAllBookings = async (filters: any, user: any) => {
  const { status, page = 1, limit = 10 } = filters;
  const where: any = {};

  if (user.role === 'CUSTOMER') where.userId = user.id;
  else if (user.role === 'PROVIDER') where.providerId = user.id;

  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: { user: true, provider: true, service: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.booking.count({ where });
  return { bookings, total, page: Number(page), limit: Number(limit) };
};

export const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      provider: true,
      service: true,
      review: true,
      // payment relation removed
    },
  });
  if (!booking) throw new Error('Booking not found');
  return booking;
};

export const updateBookingStatus = async (
  id: string,
  status: string,
  actorId: string
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error('Booking not found');

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: status as any },
  });

  const notifType =
    status === 'CONFIRMED'
      ? 'BOOKING_CONFIRMED'
      : status === 'CANCELLED'
      ? 'BOOKING_CANCELLED'
      : 'BOOKING_COMPLETED';

  await createNotification({
    userId: booking.userId,
    type: notifType as any,
    title: `Booking ${status}`,
    message: `Your booking has been ${status.toLowerCase()}.`,
  });

  return updated;
};

export const cancelBooking = async (id: string, userId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error('Booking not found');
  if (booking.userId !== userId) throw new Error('Not authorized');
  if (booking.status !== 'PENDING')
    throw new Error('Only pending bookings can be cancelled');

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  await createNotification({
    providerId: booking.providerId,
    type: 'BOOKING_CANCELLED',
    title: 'Booking Cancelled',
    message: `A booking has been cancelled by the customer.`,
  });

  return updated;
};