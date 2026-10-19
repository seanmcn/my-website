import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';
import {libraryFrontmatter} from './lib/frontmatter.mjs';

/*
 * The library: posts, notes and finds. A bad frontmatter value fails the
 * build with the file and field named; the rules live in
 * src/lib/frontmatter.mjs. The entry id is the frontmatter `slug`, which the
 * glob loader uses when present, so URLs stay as they are.
 */
const library = defineCollection({
  loader: glob({pattern: '**/*.{md,mdx}', base: './content/blog'}),
  schema: libraryFrontmatter,
});

const projects = defineCollection({
  loader: glob({pattern: '*/index.md', base: './content/projects'}),
  schema: ({image}) => z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    language: z.string(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    techStack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: image().optional(),
    gallery: z.array(z.object({
      image: image(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),
  }),
});

export const collections = {library, projects};
