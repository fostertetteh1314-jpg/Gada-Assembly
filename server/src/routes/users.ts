import { Router } from 'express';
import { getAllUsers, getUser, updateUser, deleteUser, changeRole } from '../controllers/usersController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { updateUserSchema } from '../validators/users.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'pastor'), getAllUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.patch('/:id/role', authenticate, authorize('admin'), changeRole);

export default router;
