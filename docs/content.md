# Library content

Posts, notes and finds live in `content/blog/YYYY/MM/`, one Markdown or MDX file
each, with their images in a sibling `images/` folder. This page sets out what
each one needs in its frontmatter.

The rules are enforced, not just written down:

- `src/lib/frontmatter.mjs` defines them. The build fails on a bad item and
  names the file and the field.
- `content/blog/frontmatter.schema.json` is the same rules as JSON Schema,
  generated from that file by `npm run schema`.
- `npm run test:unit` checks every item against them, along with a test per
  rule. It also fails when the JSON Schema is out of date.

## Item types

- **post**: a full article.
- **note**: a short piece.
- **find**: a link worth passing on, with a few lines on why.

`type` decides the URL (`/library/posts|notes|finds/`), the home-page section,
the colour and glyph, and how the page reads. A find shows its source link and
host where a post or note shows its read time.

## Fields

| Field | post | note | find | What it does |
| --- | --- | --- | --- | --- |
| `title` | required | required | required | Page title, listings, RSS, search |
| `type` | required | required | required | `post`, `note` or `find` |
| `date` | required | required | required | The day as `YYYY-MM-DD`, with no time. Sorting and display |
| `slug` | required | required | required | The URL under `/library/` and the item's id |
| `category` | required | required | required | One category page per value, e.g. `programming`, `ai` |
| `tags` | at least one | at least one | optional | Tag pages, search, related posts |
| `summary` | required | required | optional | One sentence: meta description, RSS text, home-page blurb, search excerpt |
| `featured` | required | required | optional | Image path relative to the item. Hero image and related-post thumbnail |
| `source` | not allowed | not allowed | required | The URL the find passes on |
| `sourceTitle` | not allowed | not allowed | optional | Label for the source link. Defaults to its host |
| `margins` | optional | optional | optional | Side notes beside the post, each a `label` and `text` |
| `series` | optional | optional | optional | Items sharing a series get a series navigator |
| `seriesOrder` | optional | optional | optional | Position in the series. Otherwise ordered by date |
| `related` | optional | optional | optional | Slugs of hand-picked related items, shown before the computed ones |
| `project` | optional | optional | optional | Slug of the project the item is about. The item shows a card linking to the project, and the project page lists the item under "Written about". A slug with no project fails the build |
| `draft` | optional | optional | optional | `true` shows it under the dev server only |
| `featuredPrompt`, `featuredStyle`, `featuredPalette` | optional | optional | optional | Written by the featured-image scripts. Don't edit by hand |

Any other key fails the build, so a typo such as `sumary` or a retired field
such as `keywords` is caught rather than silently ignored.

### Conventions the schema doesn't check

- **slug**: new items use `YYYY/MM/name`, matching the file's path under
  `content/blog/`. Older posts keep the URLs they were first published at, so
  some differ from their file names. Never change a published slug.
- **summary**: one plain sentence, usually 60-150 characters, saying what the
  item covers or concludes with its specifics. It isn't a teaser and doesn't
  start with "In this post".
- **The "In one line" margin**: a different job from `summary`. It sits in the
  sidebar and is the takeaway, where the summary describes what's in the post.
- **category and tags**: lowercase and hyphenated. Reuse existing ones where
  they fit; `npm run taxonomy` lists them with counts.
- **featured**: generate it with `npm run image` (see
  [featured-images.md](featured-images.md)). It reads the item and fills in
  `featured` and the `featured*` fields. Until the image exists, the build
  reports the missing `featured`.

## Starting a new item

Create `content/blog/YYYY/MM/name.md` (or `.mdx` for components):

```yaml
---
title: "The title"
type: 'post'
date: '2026-10-19'
slug: "2026/10/name"
category: 'programming'
tags: ['php']
summary: "What the post covers, in one sentence."
featured: 'images/featured-name.png'
margins:
  - label: 'In one line'
    text: 'The takeaway.'
---
```

For a find, swap `type` to `'find'` and add `source: 'https://…'`. `tags`,
`summary`, `featured` and `margins` are optional there.

## Changing the rules

1. Edit `src/lib/frontmatter.mjs`.
2. Run `npm run schema` to regenerate the JSON Schema.
3. Add or update a test in `tests/unit/frontmatter.test.mjs`, then run
   `npm run test:unit`.
4. Update the table above.
