import { Router } from 'express';
import { getAllDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment, addMemberToDepartment, removeMemberFromDepartment } from '../controllers/departmentsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { departmentSchema, addMemberSchema } from '../validators/departments.js';

const router = Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartment);
router.post('/', authenticate, authorize('admin', 'pastor'), validate(departmentSchema), createDepartment);
router.put('/:id', authenticate, authorize('admin', 'pastor'), validate(departmentSchema), updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), deleteDepartment);
router.post('/:id/members', authenticate, authorize('admin', 'pastor'), validate(addMemberSchema), addMemberToDepartment);
router.delete('/:id/members/:memberId', authenticate, authorize('admin', 'pastor'), removeMemberFromDepartment);

export default router;
