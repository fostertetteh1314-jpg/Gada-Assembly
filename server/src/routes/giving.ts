import { Router } from 'express';
import { getAllDonations, createDonation, getGivingStats } from '../controllers/givingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { donationSchema } from '../validators/giving.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'pastor'), getAllDonations);
router.post('/', authenticate, validate(donationSchema), createDonation);
router.get('/stats', authenticate, authorize('admin', 'pastor'), getGivingStats);

export default router;
