import { z } from 'zod';

export const donationSchema = z.object({
  member: z.string(),
  category: z.string().min(2),
  amount: z.number().min(0),
  paymentMethod: z.string().min(2),
  paymentReference: z.string().min(2),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});
