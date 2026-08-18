import { z } from 'zod';

export const memberSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  membershipStatus: z.enum(['active', 'inactive', 'visitor']).optional(),
  emergencyContact: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isProfilePublic: z.boolean().optional(),
});

export const updateMemberSchema = z.object({
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  membershipStatus: z.enum(['active', 'inactive', 'visitor']).optional(),
  emergencyContact: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isProfilePublic: z.boolean().optional(),
});
