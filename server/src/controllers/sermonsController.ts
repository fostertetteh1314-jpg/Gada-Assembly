import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { sermonSchema } from '../validators/sermons.js';

export const getAllSermons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let query = supabaseAdmin.from('sermons').select('*, created_by_user:users!created_by(first_name, last_name)').eq('is_published', true);
    if (category) {
      query = query.eq('category', category as string);
    }
    const { data: sermons, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch sermons' });
      return;
    }
    res.json({ success: true, data: sermons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sermons' });
  }
};

export const getSermon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: sermon, error } = await supabaseAdmin
      .from('sermons')
      .select('*, created_by_user:users!created_by(first_name, last_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !sermon) {
      res.status(404).json({ success: false, message: 'Sermon not found' });
      return;
    }
    res.json({ success: true, data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sermon' });
  }
};

export const createSermon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = sermonSchema.parse(req.body);
    const { data: sermon, error } = await supabaseAdmin
      .from('sermons')
      .insert({
        ...validated,
        date: new Date(validated.date),
        created_by: req.user!.id,
      })
      .select('*, created_by_user:users!created_by(first_name, last_name)')
      .single();

    if (error || !sermon) {
      res.status(500).json({ success: false, message: 'Failed to create sermon' });
      return;
    }
    res.status(201).json({ success: true, data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create sermon' });
  }
};

export const updateSermon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = sermonSchema.parse(req.body);
    const { data: sermon, error } = await supabaseAdmin
      .from('sermons')
      .update({
        ...validated,
        date: validated.date ? new Date(validated.date) : undefined,
      })
      .eq('id', req.params.id)
      .select('*, created_by_user:users!created_by(first_name, last_name)')
      .single();

    if (error || !sermon) {
      res.status(404).json({ success: false, message: 'Sermon not found' });
      return;
    }
    res.json({ success: true, data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update sermon' });
  }
};

export const deleteSermon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('sermons')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'Sermon not found' });
      return;
    }
    res.json({ success: true, message: 'Sermon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete sermon' });
  }
};
