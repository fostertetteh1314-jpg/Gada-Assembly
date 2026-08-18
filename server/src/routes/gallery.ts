import { Router } from 'express';
import { getAllAlbums, createAlbum, getAlbumItems, createGalleryItem } from '../controllers/galleryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { galleryAlbumSchema, galleryItemSchema } from '../validators/gallery.js';

const router = Router();

router.get('/', getAllAlbums);
router.post('/', authenticate, authorize('admin', 'pastor', 'leader'), validate(galleryAlbumSchema), createAlbum);
router.get('/:id/items', getAlbumItems);
router.post('/:id/items', authenticate, authorize('admin', 'pastor', 'leader'), validate(galleryItemSchema), createGalleryItem);

export default router;
