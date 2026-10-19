import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const ITEM_TYPES = ['post', 'note', 'find'];

/*
 * The library: posts, notes and finds. A bad frontmatter value fails the
 * build with the file and field named. The entry id is the frontmatter
 * `slug`, which the glob loader uses when present, so URLs stay as they are.
 */
const library = defineCollection({
  loader: glob({pattern: '**/*.{md,mdx}', base: './content/blog'}),
  schema: ({image}) => z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    type: z.string()
        .transform(value => value.trim().toLowerCase())
        .pipe(z.enum(ITEM_TYPES))
        .default('post'),
    // Finds are filed by source rather than category, so it can be absent.
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Relative to the entry; a missing file fails the build.
    featured: image().optional(),
    summary: z.string().optional(),
    margins: z.array(z.object({
      label: z.string(),
      text: z.string(),
    })).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().int().optional(),
    related: z.array(z.string()).default([]),
    source: z.string().url().optional(),
    sourceTitle: z.string().optional(),
    draft: z.boolean().default(false),
  }),
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
