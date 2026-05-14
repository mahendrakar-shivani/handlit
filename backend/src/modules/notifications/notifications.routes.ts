import { Router } from 'express';
import * as notificationsController from './notifications.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/',              protect, notificationsController.getNotifications);
router.patch('/read-all',    protect, notificationsController.markAllAsRead);
router.patch('/:id/read',    protect, notificationsController.markAsRead);
router.delete('/:id',        protect, notificationsController.deleteNotification);

export default router;