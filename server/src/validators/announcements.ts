import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  image: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
});
