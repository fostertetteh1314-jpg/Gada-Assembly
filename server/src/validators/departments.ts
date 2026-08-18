import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  leaders: z.array(z.string()).optional(),
});

export const addMemberSchema = z.object({
  memberId: z.string(),
});
