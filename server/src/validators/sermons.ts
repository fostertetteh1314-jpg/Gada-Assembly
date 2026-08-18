import { z } from 'zod';

export const sermonSchema = z.object({
  title: z.string().min(3),
  speaker: z.string().min(2),
  date: z.string(),
  scripture: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  thumbnail: z.string().optional(),
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});
