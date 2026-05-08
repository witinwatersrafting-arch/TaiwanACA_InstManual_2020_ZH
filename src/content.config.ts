import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const manualCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/manual' }),
  schema: z.object({
    title: z.string().optional(),
    en_title: z.string().optional(),
    description: z.string().optional(),
    en_description: z.string().optional(),
    unit_number: z.number().optional(),
  }),
});

export const collections = {
  'manual': manualCollection,
};
