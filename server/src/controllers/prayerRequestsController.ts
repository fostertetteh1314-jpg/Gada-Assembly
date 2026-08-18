import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { prayerRequestSchema } from '../validators/prayerRequests.js';

export const getAllPrayerRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let query = supabaseAdmin
      .from('prayer_requests')
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name, email), handled_by_user:users!handled_by(first_name, last_name)');

    if (status) {
      query = query.eq('status', status as string);
    }

    const { data: requests, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch prayer requests' });
      return;
    }
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch prayer requests' });
  }
};

export const getPrayerRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: request, error } = await supabaseAdmin
      .from('prayer_requests')
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name, email), handled_by_user:users!handled_by(first_name, last_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !request) {
      res.status(404).json({ success: false, message: 'Prayer request not found' });
      return;
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch prayer request' });
  }
};

export const createPrayerRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = prayerRequestSchema.parse(req.body);
    const { data: prayerRequest, error } = await supabaseAdmin
      .from('prayer_requests')
      .insert({
        ...validated,
        submitted_by: req.user!.id,
      })
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name, email), handled_by_user:users!handled_by(first_name, last_name)')
      .single();

    if (error || !prayerRequest) {
      res.status(500).json({ success: false, message: 'Failed to create prayer request' });
      return;
    }
    res.status(201).json({ success: true, data: prayerRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create prayer request' });
  }
};

export const updatePrayerRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, handledBy } = req.body;
    const { data: prayerRequest, error } = await supabaseAdmin
      .from('prayer_requests')
      .update({
        status: status || undefined,
        handled_by: handledBy || undefined,
      })
      .eq('id', req.params.id)
      .select('*, submitted_by_user:users!submitted_by(first_name, last_name, email), handled_by_user:users!handled_by(first_name, last_name)')
      .single();

    if (error || !prayerRequest) {
      res.status(404).json({ success: false, message: 'Prayer request not found' });
      return;
    }
    res.json({ success: true, data: prayerRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};
