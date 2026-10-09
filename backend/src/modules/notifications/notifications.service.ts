import prisma from '../../utils/prisma';
import { NotificationType } from '@prisma/client';

export const createNotification = async (data: {
  userId?: string;
  providerId?: string;
  type: NotificationType;
  title: string;
  message: string;
}) => {
  return prisma.notification.create({ data });
};

export const getNotifications = async (userId?: string, providerId?: string) => {
  const where: any = {};
  if (userId) where.userId = userId;
  if (providerId) where.providerId = providerId;
  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id: string) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId?: string, providerId?: string) => {
  const where: any = { isRead: false };
  if (userId) where.userId = userId;
  if (providerId) where.providerId = providerId;
  return prisma.notification.updateMany({ where, data: { isRead: true } });
};

export const deleteNotification = async (id: string) => {
  return prisma.notification.delete({ where: { id } });
};