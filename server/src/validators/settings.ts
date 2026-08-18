import { z } from 'zod';

export const settingsSchema = z.object({
  churchName: z.string().optional(),
  district: z.string().optional(),
  assemblyName: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  serviceTimes: z.record(z.string()).optional(),
  socialLinks: z.record(z.string()).optional(),
  givingInstructions: z.string().optional(),
  defaultScripture: z.object({
    text: z.string(),
    reference: z.string(),
  }).optional(),
});
