import { z } from 'zod';

export const galleryAlbumSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  coverImage: z.string().url(),
});

export const galleryItemSchema = z.object({
  album: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  caption: z.string().optional(),
});
