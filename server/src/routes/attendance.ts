import { Router } from 'express';
import { getSessions, createSession, getSessionRecords, recordAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { attendanceSessionSchema, attendanceRecordSchema } from '../validators/attendance.js';

const router = Router();

router.get('/sessions', authenticate, getSessions);
router.post('/sessions', authenticate, authorize('admin', 'pastor', 'leader'), validate(attendanceSessionSchema), createSession);
router.get('/sessions/:sessionId/records', authenticate, getSessionRecords);
router.post('/sessions/:sessionId/record', authenticate, authorize('admin', 'pastor', 'leader'), validate(attendanceRecordSchema), recordAttendance);
router.get('/stats', authenticate, getAttendanceStats);

export default router;
