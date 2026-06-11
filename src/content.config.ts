import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localized = z
  .object({
    it: z.string().nullable().optional(),
    en: z.string().nullable().optional(),
    es: z.string().nullable().optional(),
    fr: z.string().nullable().optional(),
    zh: z.string().nullable().optional(),
    hi: z.string().nullable().optional(),
    ar: z.string().nullable().optional(),
  })
  .default({});

const artworks = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/artworks' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number(),
      technique: z.string().default(''),
      dimensions: z.string().default(''),
      kind: z.enum(['original', 'print']),
      price: z.number(),
      sold: z.boolean().default(false),
      editionSize: z.number().nullable().optional(),
      stock: z.number().nullable().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().default(0),
      images: z.array(image()).min(1),
      descriptions: localized,
    }),
});

export const collections = { artworks };
