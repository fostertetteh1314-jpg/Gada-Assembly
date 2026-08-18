import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { eventSchema, eventRegistrationSchema } from '../validators/events.js';

export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { upcoming } = req.query;
    let query = supabaseAdmin.from('events').select('*, organizer_user:users!organizer(first_name, last_name)').eq('is_published', true);
    if (upcoming === 'true') {
      query = query.gte('date', new Date().toISOString());
    }
    const { data: events, error } = await query.order('date', { ascending: true });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
      return;
    }
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select('*, organizer_user:users!organizer(first_name, last_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = eventSchema.parse(req.body);
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
        ...validated,
        date: new Date(validated.date),
        organizer: req.user!.id,
      })
      .select('*, organizer_user:users!organizer(first_name, last_name)')
      .single();

    if (error || !event) {
      res.status(500).json({ success: false, message: 'Failed to create event' });
      return;
    }
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = eventSchema.parse(req.body);
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update({
        ...validated,
        date: validated.date ? new Date(validated.date) : undefined,
      })
      .eq('id', req.params.id)
      .select('*, organizer_user:users!organizer(first_name, last_name)')
      .single();

    if (error || !event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = eventRegistrationSchema.parse(req.body);
    const { data: registration, error } = await supabaseAdmin
      .from('event_registrations')
      .insert({
        ...validated,
        event_id: req.params.id,
        email: req.user?.email || validated.email,
      })
      .select('*')
      .single();

    if (error || !registration) {
      res.status(500).json({ success: false, message: 'Registration failed' });
      return;
    }
    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};
