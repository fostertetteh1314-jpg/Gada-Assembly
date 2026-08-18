import { Router } from 'express';
import { getAllLeaders, createLeader, updateLeader, deleteLeader } from '../controllers/leadersController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { leaderSchema } from '../validators/leaders.js';

const router = Router();

router.get('/', getAllLeaders);
router.post('/', authenticate, authorize('admin', 'pastor'), validate(leaderSchema), createLeader);
router.put('/:id', authenticate, authorize('admin', 'pastor'), validate(leaderSchema), updateLeader);
router.delete('/:id', authenticate, authorize('admin'), deleteLeader);

export default router;
