import { z } from 'zod';

export const prayerRequestSchema = z.object({
  subject: z.string().min(3),
  request: z.string().min(10),
  category: z.string().min(2),
  isAnonymous: z.boolean().optional(),
  preferredFollowUp: z.string().optional(),
  status: z.enum(['new', 'being_prayed_for', 'follow_up_required', 'resolved']).optional(),
});
