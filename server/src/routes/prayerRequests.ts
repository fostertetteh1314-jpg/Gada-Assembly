import { Router } from 'express';
import { getAllPrayerRequests, getPrayerRequest, createPrayerRequest, updatePrayerRequestStatus } from '../controllers/prayerRequestsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { prayerRequestSchema } from '../validators/prayerRequests.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'pastor', 'leader'), getAllPrayerRequests);
router.get('/:id', authenticate, getPrayerRequest);
router.post('/', validate(prayerRequestSchema), createPrayerRequest);
router.patch('/:id/status', authenticate, authorize('admin', 'pastor', 'leader'), updatePrayerRequestStatus);

export default router;
