import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { settingsSchema } from '../validators/settings.js';

export const getSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: settings } = await supabaseAdmin
      .from('church_settings')
      .select('*')
      .single();

    if (!settings) {
      const { data: newSettings } = await supabaseAdmin
        .from('church_settings')
        .insert({})
        .select('*')
        .single();

      if (!newSettings) {
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
        return;
      }
      res.json({ success: true, data: newSettings });
      return;
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = settingsSchema.parse(req.body);

    const { data: existingSettings } = await supabaseAdmin
      .from('church_settings')
      .select('id')
      .single();

    let settings;
    if (existingSettings) {
      const { data, error } = await supabaseAdmin
        .from('church_settings')
        .update(validated)
        .eq('id', existingSettings.id)
        .select('*')
        .single();

      if (error || !data) {
        res.status(500).json({ success: false, message: 'Failed to update settings' });
        return;
      }
      settings = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('church_settings')
        .insert(validated)
        .select('*')
        .single();

      if (error || !data) {
        res.status(500).json({ success: false, message: 'Failed to update settings' });
        return;
      }
      settings = data;
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};
