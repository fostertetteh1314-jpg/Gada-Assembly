import { Router } from 'express';
import { getAllNotifications, markAsRead, createNotification } from '../controllers/notificationsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { notificationSchema } from '../validators/notifications.js';

const router = Router();

router.get('/', authenticate, getAllNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.post('/', authenticate, authorize('admin', 'pastor', 'leader'), validate(notificationSchema), createNotification);

export default router;
