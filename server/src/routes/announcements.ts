import { Router } from 'express';
import { getAllAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { announcementSchema } from '../validators/announcements.js';

const router = Router();

router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', authenticate, authorize('admin', 'pastor', 'leader'), validate(announcementSchema), createAnnouncement);
router.put('/:id', authenticate, authorize('admin', 'pastor', 'leader'), validate(announcementSchema), updateAnnouncement);
router.delete('/:id', authenticate, authorize('admin', 'pastor'), deleteAnnouncement);

export default router;
