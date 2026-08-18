import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { galleryAlbumSchema, galleryItemSchema } from '../validators/gallery.js';

export const getAllAlbums = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: albums, error } = await supabaseAdmin
      .from('gallery_albums')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch albums' });
      return;
    }
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch albums' });
  }
};

export const createAlbum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = galleryAlbumSchema.parse(req.body);
    const { data: album, error } = await supabaseAdmin
      .from('gallery_albums')
      .insert(validated)
      .select('*')
      .single();

    if (error || !album) {
      res.status(500).json({ success: false, message: 'Failed to create album' });
      return;
    }
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create album' });
  }
};

export const getAlbumItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('gallery_items')
      .select('*')
      .eq('album_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch items' });
      return;
    }
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch items' });
  }
};

export const createGalleryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = galleryItemSchema.parse(req.body);
    const { data: item, error } = await supabaseAdmin
      .from('gallery_items')
      .insert(validated)
      .select('*')
      .single();

    if (error || !item) {
      res.status(500).json({ success: false, message: 'Failed to create item' });
      return;
    }
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
};
