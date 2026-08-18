import { z } from 'zod';

export const notificationSchema = z.object({
  recipient: z.string(),
  type: z.string().min(2),
  title: z.string().min(2),
  message: z.string().min(10),
});
