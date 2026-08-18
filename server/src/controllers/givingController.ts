import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { donationSchema } from '../validators/giving.js';

export const getAllDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.query;
    let query = supabaseAdmin
      .from('donations')
      .select('*, member:member_profiles!member_id(*)')
      .order('created_at', { ascending: false });

    if (memberId) {
      query = query.eq('member_id', memberId as string);
    }

    const { data: donations, error } = await query;

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch donations' });
      return;
    }
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
};

export const createDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = donationSchema.parse(req.body);
    const { data: donation, error } = await supabaseAdmin
      .from('donations')
      .insert(validated)
      .select('*, member:member_profiles!member_id(*)')
      .single();

    if (error || !donation) {
      res.status(500).json({ success: false, message: 'Failed to create donation' });
      return;
    }
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create donation' });
  }
};

export const getGivingStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: donations, error } = await supabaseAdmin
      .from('donations')
      .select('category, amount')
      .eq('status', 'completed');

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch stats' });
      return;
    }

    const byCategory: Record<string, { total: number; count: number }> = {};
    let totalAmount = 0;

    donations?.forEach((d: any) => {
      const amount = parseFloat(d.amount);
      totalAmount += amount;
      if (!byCategory[d.category]) {
        byCategory[d.category] = { total: 0, count: 0 };
      }
      byCategory[d.category].total += amount;
      byCategory[d.category].count += 1;
    });

    const stats = Object.entries(byCategory).map(([category, data]) => ({ _id: category, total: data.total }));

    res.json({ success: true, data: { stats, total: totalAmount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
