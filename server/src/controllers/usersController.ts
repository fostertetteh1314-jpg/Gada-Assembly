import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { updateUserSchema } from '../validators/users.js';
import { mapIdToUnderscoreId, mapArrayIds } from '../utils/transform.js';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
      return;
    }
    res.json({ success: true, data: mapArrayIds(users || []) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, is_active, created_at')
      .eq('id', req.params.id)
      .single();

    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: mapIdToUnderscoreId(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = updateUserSchema.parse(req.body);
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(validated)
      .eq('id', req.params.id)
      .select('id, email, first_name, last_name, role, is_active, created_at')
      .single();

    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: mapIdToUnderscoreId(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const changeRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select('id, email, first_name, last_name, role, is_active, created_at')
      .single();

    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: mapIdToUnderscoreId(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change role' });
  }
};
