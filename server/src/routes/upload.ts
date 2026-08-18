import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
