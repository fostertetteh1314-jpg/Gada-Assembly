import { z } from 'zod';

export const attendanceSessionSchema = z.object({
  name: z.string().min(3),
  date: z.string(),
  eventType: z.string().min(2),
  isActive: z.boolean().optional(),
});

export const attendanceRecordSchema = z.object({
  session: z.string(),
  member: z.string(),
  status: z.enum(['present', 'absent', 'visitor', 'first_timer', 'child']),
});
