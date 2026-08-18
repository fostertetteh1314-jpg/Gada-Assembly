import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { leaderSchema } from '../validators/leaders.js';

export const getAllLeaders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: leaders, error } = await supabaseAdmin
      .from('leaders')
      .select('*, user:users!user_id(first_name, last_name, email)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch leaders' });
      return;
    }
    res.json({ success: true, data: leaders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaders' });
  }
};

export const createLeader = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = leaderSchema.parse(req.body);
    const { data: leader, error } = await supabaseAdmin
      .from('leaders')
      .insert(validated)
      .select('*, user:users!user_id(first_name, last_name, email)')
      .single();

    if (error || !leader) {
      res.status(500).json({ success: false, message: 'Failed to create leader' });
      return;
    }
    res.status(201).json({ success: true, data: leader });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create leader' });
  }
};

export const updateLeader = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = leaderSchema.parse(req.body);
    const { data: leader, error } = await supabaseAdmin
      .from('leaders')
      .update(validated)
      .eq('id', req.params.id)
      .select('*, user:users!user_id(first_name, last_name, email)')
      .single();

    if (error || !leader) {
      res.status(404).json({ success: false, message: 'Leader not found' });
      return;
    }
    res.json({ success: true, data: leader });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update leader' });
  }
};

export const deleteLeader = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('leaders')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'Leader not found' });
      return;
    }
    res.json({ success: true, message: 'Leader deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete leader' });
  }
};
