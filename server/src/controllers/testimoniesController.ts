import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { testimonySchema } from '../validators/testimonies.js';

export const getAllTestimonies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let query = supabaseAdmin
      .from('testimonies')
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name), reviewed_by_user:users!reviewed_by(first_name, last_name)');

    if (status) {
      query = query.eq('status', status as string);
    } else {
      query = query.eq('status', 'approved');
    }

    const { data: testimonies, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch testimonies' });
      return;
    }
    res.json({ success: true, data: testimonies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonies' });
  }
};

export const getTestimony = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: testimony, error } = await supabaseAdmin
      .from('testimonies')
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name), reviewed_by_user:users!reviewed_by(first_name, last_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !testimony) {
      res.status(404).json({ success: false, message: 'Testimony not found' });
      return;
    }
    res.json({ success: true, data: testimony });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimony' });
  }
};

export const createTestimony = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = testimonySchema.parse(req.body);
    const { data: testimony, error } = await supabaseAdmin
      .from('testimonies')
      .insert({
        ...validated,
        submitted_by: req.user!.id,
      })
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name), reviewed_by_user:users!reviewed_by(first_name, last_name)')
      .single();

    if (error || !testimony) {
      res.status(500).json({ success: false, message: 'Failed to create testimony' });
      return;
    }
    res.status(201).json({ success: true, data: testimony });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create testimony' });
  }
};

export const approveTestimony = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: testimony, error } = await supabaseAdmin
      .from('testimonies')
      .update({ status: 'approved', reviewed_by: req.user!.id })
      .eq('id', req.params.id)
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name), reviewed_by_user:users!reviewed_by(first_name, last_name)')
      .single();

    if (error || !testimony) {
      res.status(404).json({ success: false, message: 'Testimony not found' });
      return;
    }
    res.json({ success: true, data: testimony });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve testimony' });
  }
};

export const rejectTestimony = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: testimony, error } = await supabaseAdmin
      .from('testimonies')
      .update({ status: 'rejected', reviewed_by: req.user!.id })
      .eq('id', req.params.id)
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name), reviewed_by_user:users!reviewed_by(first_name, last_name)')
      .single();

    if (error || !testimony) {
      res.status(404).json({ success: false, message: 'Testimony not found' });
      return;
    }
    res.json({ success: true, data: testimony });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject testimony' });
  }
};
