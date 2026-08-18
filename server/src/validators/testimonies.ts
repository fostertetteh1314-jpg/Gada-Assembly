import { z } from 'zod';

export const testimonySchema = z.object({
  title: z.string().min(3),
  testimony: z.string().min(20),
  isAnonymous: z.boolean().optional(),
  permissionToPublish: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});
