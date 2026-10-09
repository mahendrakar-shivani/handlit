import prisma from '../../utils/prisma';

export const createReview = async (data: any) => {
  const { bookingId, userId, providerId, rating, comment } = data;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'COMPLETED') throw new Error('Can only review completed bookings');
  if (booking.userId !== userId) throw new Error('Not authorized');

  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) throw new Error('Review already submitted for this booking');

  const review = await prisma.review.create({
    data: { bookingId, userId, providerId, rating, comment },
  });

  const reviews = await prisma.review.findMany({
    where: { providerId },
    select: { rating: true },
  });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await prisma.provider.update({
    where: { id: providerId },
    data: { rating: parseFloat(avg.toFixed(1)) },
  });

  return review;
};

export const getProviderReviews = async (providerId: string) => {
  return prisma.review.findMany({
    where: { providerId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteReview = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error('Review not found');
  if (review.userId !== userId) throw new Error('Not authorized');
  return prisma.review.delete({ where: { id } });
};