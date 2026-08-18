import { Router } from 'express';
import { getAllSermons, getSermon, createSermon, updateSermon, deleteSermon } from '../controllers/sermonsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { sermonSchema } from '../validators/sermons.js';

const router = Router();

router.get('/', getAllSermons);
router.get('/:id', getSermon);
router.post('/', authenticate, authorize('admin', 'pastor', 'leader'), validate(sermonSchema), createSermon);
router.put('/:id', authenticate, authorize('admin', 'pastor', 'leader'), validate(sermonSchema), updateSermon);
router.delete('/:id', authenticate, authorize('admin', 'pastor'), deleteSermon);

export default router;
