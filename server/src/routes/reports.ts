import { Router } from 'express';
import { getMembershipStats, getAttendanceReport, getEventsReport, getGivingReport } from '../controllers/reportsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/membership', authenticate, authorize('admin', 'pastor'), getMembershipStats);
router.get('/attendance', authenticate, authorize('admin', 'pastor'), getAttendanceReport);
router.get('/events', authenticate, authorize('admin', 'pastor'), getEventsReport);
router.get('/giving', authenticate, authorize('admin', 'pastor'), getGivingReport);

export default router;
