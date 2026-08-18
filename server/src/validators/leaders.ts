import { z } from 'zod';

export const leaderSchema = z.object({
  user: z.string(),
  position: z.string().min(2),
  bio: z.string().min(20),
  photo: z.string().optional(),
  isActive: z.boolean().optional(),
});
