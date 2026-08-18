import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(3),
  banner: z.string().optional(),
  organizer: z.string(),
  category: z.string().min(2),
  registrationRequired: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const eventRegistrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  numberOfAttendees: z.number().min(1),
});
