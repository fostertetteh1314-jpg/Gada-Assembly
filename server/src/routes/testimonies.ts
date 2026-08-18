import { Router } from 'express';
import { getAllTestimonies, getTestimony, createTestimony, approveTestimony, rejectTestimony } from '../controllers/testimoniesController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { testimonySchema } from '../validators/testimonies.js';

const router = Router();

router.get('/', authenticate, getAllTestimonies);
router.get('/:id', authenticate, getTestimony);
router.post('/', authenticate, validate(testimonySchema), createTestimony);
router.patch('/:id/approve', authenticate, authorize('admin', 'pastor', 'leader'), approveTestimony);
router.patch('/:id/reject', authenticate, authorize('admin', 'pastor', 'leader'), rejectTestimony);

export default router;
