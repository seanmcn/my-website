import {z} from 'astro/zod';

/*
 * Library frontmatter: one shape per item type, picked by `type`. Unknown
 * keys fail, so a typo or a retired field is caught rather than dropped.
 * docs/content.md explains the rules in prose, and
 * content/blog/frontmatter.schema.json is generated from this file by
 * `npm run schema` (a unit test fails while it is out of date).
 *
 * `image` is Astro's image() helper; outside Astro, pass a plain string.
 */
export function libraryFrontmatter({image}) {
  const shared = {
    title: z.string().min(1),
    slug: z.string().min(1)
        .describe('The URL under /library/ and the entry id. ' +
          'Usually YYYY/MM/name; older posts keep their original URLs.'),
    date: z.coerce.date(),
    category: z.string().min(1)
        .describe('One lowercase category, e.g. programming or ai.'),
    margins: z.array(z.strictObject({
      label: z.string().min(1),
      text: z.string().min(1),
    })).default([])
        .describe('Side notes shown beside the post, e.g. "In one line".'),
    series: z.string().optional()
        .describe('Posts sharing a series get a series navigator.'),
    seriesOrder: z.number().int().optional(),
    related: z.array(z.string()).default([])
        .describe('Slugs of hand-picked related items, shown first.'),
    draft: z.boolean().default(false)
        .describe('Shown under the dev server, left out of builds.'),
    // Written by scripts/*-featured-image.mjs to regenerate the image.
    featuredPrompt: z.string().optional(),
    featuredStyle: z.string().optional(),
    featuredPalette: z.string().optional(),
  };

  // Posts and notes are written here, so they carry their own summary,
  // tags and image.
  const written = {
    ...shared,
    summary: z.string().min(1)
        .describe('One sentence: the meta description, RSS text, ' +
          'home-page blurb and search excerpt.'),
    tags: z.array(z.string().min(1)).min(1),
    featured: image()
        .describe('Image path relative to the entry.'),
  };

  return z.discriminatedUnion('type', [
    z.strictObject({
      type: z.literal('post').describe('A full article.'),
      ...written,
    }),
    z.strictObject({
      type: z.literal('note').describe('A short piece.'),
      ...written,
    }),
    z.strictObject({
      type: z.literal('find').describe('A link worth passing on.'),
      ...shared,
      source: z.url().describe('The link the find passes on.'),
      sourceTitle: z.string().optional()
          .describe('Label for the source link; defaults to its host.'),
      summary: z.string().min(1).optional(),
      tags: z.array(z.string().min(1)).default([]),
      featured: image().optional(),
    }),
  ]);
}

// The JSON Schema editors and agents read, built the way Astro builds its own.
export function libraryFrontmatterJSONSchema() {
  return z.toJSONSchema(libraryFrontmatter({image: () => z.string()}), {
    io: 'input',
    unrepresentable: 'any',
    override: (ctx) => {
      if (ctx.zodSchema._zod.def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
}
