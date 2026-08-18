import { Response } from 'express';
import { getMembershipReport, getAttendanceReport as getAttendanceReportSvc, getEventsReport as getEventsReportSvc, getGivingReport as getGivingReportSvc } from '../services/reportService.js';
import { AuthRequest } from '../middleware/auth.js';

export const getMembershipStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await getMembershipReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch membership report' });
  }
};

export const getAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await getAttendanceReportSvc(req.query.sessionId as string);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance report' });
  }
};

export const getEventsReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await getEventsReportSvc();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events report' });
  }
};

export const getGivingReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await getGivingReportSvc();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch giving report' });
  }
};
