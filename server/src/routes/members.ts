import { Router } from 'express';
import { getAllMembers, getMember, createMember, updateMember, deleteMember } from '../controllers/membersController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { memberSchema, updateMemberSchema } from '../validators/members.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'pastor', 'leader'), getAllMembers);
router.get('/:id', authenticate, getMember);
router.post('/', authenticate, authorize('admin', 'pastor'), validate(memberSchema), createMember);
router.put('/:id', authenticate, validate(updateMemberSchema), updateMember);
router.delete('/:id', authenticate, authorize('admin'), deleteMember);

export default router;
