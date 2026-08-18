import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { notificationSchema } from '../validators/notifications.js';

export const getAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('recipient', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
      return;
    }
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .select('recipient')
      .eq('id', req.params.id)
      .single();

    if (error || !notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    if (notification.recipient !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (updateError || !updated) {
      res.status(500).json({ success: false, message: 'Failed to mark as read' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = notificationSchema.parse(req.body);
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert(validated)
      .select('*')
      .single();

    if (error || !notification) {
      res.status(500).json({ success: false, message: 'Failed to create notification' });
      return;
    }
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
};
