import { Request, Response } from 'express';
import * as notificationsService from './notifications.service';

export const getNotifications = async (req: any, res: Response) => {
  try {
    const { id, role } = req.user;
    const notifications =
      role === 'PROVIDER'
        ? await notificationsService.getNotifications(undefined, id)
        : await notificationsService.getNotifications(id, undefined);
    res.status(200).json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await notificationsService.markAsRead(
      req.params['id'] as string
    );
    res.status(200).json(notification);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const markAllAsRead = async (req: any, res: Response) => {
  try {
    const { id, role } = req.user;
    role === 'PROVIDER'
      ? await notificationsService.markAllAsRead(undefined, id)
      : await notificationsService.markAllAsRead(id, undefined);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await notificationsService.deleteNotification(req.params['id'] as string);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};