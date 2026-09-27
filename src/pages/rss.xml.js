import path from 'node:path';
import rss from '@astrojs/rss';
import {getImage} from 'astro:assets';
import {excerpt, getLibraryItems} from '../lib/library.js';

/*
 * The whole library, not just the posts: a note or a find is exactly the kind
 * of short item a reader subscribes for. Markdown entries carry their full
 * rendered body as content:encoded; MDX ones, whose components only render
 * inside a page, carry the summary alone.
 */

const IMAGES = import.meta.glob('/content/blog/**/*.{png,jpg,jpeg,gif,webp}', {
  eager: true,
  import: 'default',
});

/*
 * The stored HTML marks each Markdown image with a placeholder that Astro
 * only resolves when the page renders. Resolve them here instead, to
 * absolute URLs, since a feed reader has no page to be relative to.
 */
async function withImages(html, filePath, site) {
  const placeholders = [...html.matchAll(/<img __ASTRO_IMAGE_="([^"]+)">/g)];
  let resolved = html;

  for (const [tag, encoded] of placeholders) {
    const {alt, src} = JSON.parse(encoded.replace(/&quot;/g, '"'));
    const file = `/${path.join(path.dirname(filePath), src)}`;
    const image = IMAGES[file] ?
      await getImage({src: IMAGES[file]}) :
      null;

    resolved = resolved.replace(tag, image ?
      `<img alt="${alt || ''}" src="${new URL(image.src, site)}">` :
      '');
  }

  return resolved;
}

export async function GET(context) {
  const items = await getLibraryItems();

  return rss({
    title: 'Seanmcn.com RSS feed',
    description: 'Seán McNamara\'s personal website, containing articles ' +
      'surrounding programming, technology, games & reviews.',
    site: context.site,
    items: await Promise.all(items.map(async item => ({
      title: item.data.title,
      link: `/library/${item.data.slug}/`,
      pubDate: item.data.date,
      description: item.data.summary || excerpt(item, 300),
      categories: [item.data.type],
      ...(item.rendered?.html && {
        content: await withImages(item.rendered.html, item.filePath,
            context.site),
      }),
    }))),
  });
}
