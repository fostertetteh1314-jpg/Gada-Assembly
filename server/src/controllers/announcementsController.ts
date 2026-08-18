import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { announcementSchema } from '../validators/announcements.js';

export const getAllAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: announcements, error } = await supabaseAdmin
      .from('announcements')
      .select('*, author_user:users!author(first_name, last_name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
      return;
    }
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

export const getAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .select('*, author_user:users!author(first_name, last_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !announcement) {
      res.status(404).json({ success: false, message: 'Announcement not found' });
      return;
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcement' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = announcementSchema.parse(req.body);
    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        ...validated,
        author: req.user!.id,
      })
      .select('*, author_user:users!author(first_name, last_name)')
      .single();

    if (error || !announcement) {
      res.status(500).json({ success: false, message: 'Failed to create announcement' });
      return;
    }
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = announcementSchema.parse(req.body);
    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .update(validated)
      .eq('id', req.params.id)
      .select('*, author_user:users!author(first_name, last_name)')
      .single();

    if (error || !announcement) {
      res.status(404).json({ success: false, message: 'Announcement not found' });
      return;
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update announcement' });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'Announcement not found' });
      return;
    }
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
};
