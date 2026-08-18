import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { settingsSchema } from '../validators/settings.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize('admin', 'pastor'), validate(settingsSchema), updateSettings);

export default router;
