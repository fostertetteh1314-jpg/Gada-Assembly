import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { attendanceSessionSchema, attendanceRecordSchema } from '../validators/attendance.js';

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: sessions, error } = await supabaseAdmin
      .from('attendance_sessions')
      .select('*, created_by_user:users!created_by(first_name, last_name)')
      .order('date', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
      return;
    }
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
  }
};

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = attendanceSessionSchema.parse(req.body);
    const { data: session, error } = await supabaseAdmin
      .from('attendance_sessions')
      .insert({
        ...validated,
        date: new Date(validated.date),
        created_by: req.user!.id,
      })
      .select('*, created_by_user:users!created_by(first_name, last_name)')
      .single();

    if (error || !session) {
      res.status(500).json({ success: false, message: 'Failed to create session' });
      return;
    }
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create session' });
  }
};

export const getSessionRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: records, error } = await supabaseAdmin
      .from('attendance_records')
      .select('*, member:member_profiles!member_id(*), session:attendance_sessions!session_id(*)')
      .eq('session_id', req.params.sessionId);

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch records' });
      return;
    }
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch records' });
  }
};

export const recordAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = attendanceRecordSchema.parse(req.body);
    const { data: record, error } = await supabaseAdmin
      .from('attendance_records')
      .insert(validated)
      .select('*, member:member_profiles!member_id(*), session:attendance_sessions!session_id(*)')
      .single();

    if (error || !record) {
      res.status(500).json({ success: false, message: 'Failed to record attendance' });
      return;
    }
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record attendance' });
  }
};

export const getAttendanceStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: records, error } = await supabaseAdmin
      .from('attendance_records')
      .select('status');

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch stats' });
      return;
    }

    const stats: Record<string, number> = {};
    records?.forEach((r: any) => {
      stats[r.status] = (stats[r.status] || 0) + 1;
    });

    res.json({ success: true, data: Object.entries(stats).map(([status, count]) => ({ _id: status, count })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
