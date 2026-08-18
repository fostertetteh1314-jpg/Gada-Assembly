import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['admin', 'pastor', 'leader', 'member', 'visitor']),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(['admin', 'pastor', 'leader', 'member', 'visitor']).optional(),
  isActive: z.boolean().optional(),
});
