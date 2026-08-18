import { Router } from 'express';
import { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent } from '../controllers/eventsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { eventSchema, eventRegistrationSchema } from '../validators/events.js';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, authorize('admin', 'pastor', 'leader'), validate(eventSchema), createEvent);
router.put('/:id', authenticate, authorize('admin', 'pastor', 'leader'), validate(eventSchema), updateEvent);
router.delete('/:id', authenticate, authorize('admin', 'pastor'), deleteEvent);
router.post('/:id/register', authenticate, validate(eventRegistrationSchema), registerForEvent);

export default router;
