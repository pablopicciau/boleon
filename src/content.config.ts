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
      // Titolo tradotto per lingua (opzionale): se vuoto usa il titolo qui sopra
      titles: localized,
      dimensions: z.string().default(''),
      kind: z.enum(['original', 'print']),
      price: z.number().nullable().optional(),
      // Originale non acquistabile online: mostra solo il modulo "richiedi informazioni"
      originalInquiryOnly: z.boolean().default(false),
      sold: z.boolean().default(false),
      editionSize: z.number().nullable().optional(),
      stock: z.number().nullable().optional(),
      featured: z.boolean().default(false),
      // Mostrata nella sottosezione "I più venduti" della galleria
      bestseller: z.boolean().default(false),
      // Slug delle collezioni a cui l'opera appartiene (es. "bianco-e-nero")
      collections: z.array(z.string()).default([]),
      // Numero manuale nella collezione ("N° X"); vuoto = calcolato dall'ordinamento
      collectionNumber: z.number().nullable().optional(),
      sortOrder: z.number().default(0),
      images: z.array(image()).min(1),
      descriptions: localized,
      // Se true, il sito mostra ai visitatori quante copie restano del pezzo base
      showAvailability: z.boolean().default(false),
      // Stampe fine art: i formati/prezzi standard vivono in site-shop.json;
      // qui l'opera dice solo se le offre, in quali formati e con che aumento %
      printsEnabled: z.boolean().default(true),
      printFormats: z.array(z.string()).default([]),
      printPricePercent: z.number().default(0),
    }),
});

// Le collezioni tematiche della galleria (es. "Bianco e nero"), gestite da Keystatic
const artCollections = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/collections' }),
  schema: z.object({
    name: z.string(),
    names: localized,
    // Storia / descrizione della collezione, mostrata nella galleria
    descriptions: localized,
    sortOrder: z.number().default(0),
  }),
});

export const collections = { artworks, collections: artCollections };
