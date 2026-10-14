import {defineHastPlugin, defineMdastPlugin} from 'satteri';
import * as emoji from 'node-emoji';
import {IMAGE_SIZES} from '../lib/image-sizes.js';

/*
 * The site's own Markdown plugins, written for Sätteri, the processor Astro
 * uses by default. Plugins run in array order, MDAST first and HAST second;
 * astro.config.mjs lists them.
 */

const YOUTUBE_HOSTS = new Set([
  'youtu.be',
  'www.youtu.be',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
]);

function youTubeEmbedUrl(url) {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(parsed.hostname)) {
    return null;
  }

  let id = '';

  if (parsed.hostname.includes('youtu.be')) {
    id = parsed.pathname.slice(1);
  } else if (parsed.pathname === '/watch') {
    id = parsed.searchParams.get('v') || '';
  } else if (/^\/(embed|shorts)\//.test(parsed.pathname)) {
    id = parsed.pathname.split('/')[2] || '';
  }

  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/*
 * A paragraph that is nothing but a YouTube link, bare or as [text](url),
 * becomes an embedded player. Only top-level paragraphs, so a link inside a
 * list or a quote stays a link.
 */
export const youTubeEmbeds = defineMdastPlugin({
  name: 'youtube-embeds',
  paragraph(node, ctx) {
    if (ctx.parent(node)?.type !== 'root' || node.children.length !== 1) {
      return undefined;
    }

    const [child] = node.children;
    const url = child.type === 'link' ? child.url :
      child.type === 'text' ? child.value.trim() :
      null;
    const embedUrl = url && youTubeEmbedUrl(url);

    if (!embedUrl) {
      return undefined;
    }

    const iframe = {
      src: embedUrl,
      title: 'Embedded YouTube video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
        'gyroscope; picture-in-picture; web-share',
    };

    // MDX has no raw HTML, so it gets the same markup as JSX elements.
    if (ctx.sourceFormat === 'mdx') {
      const attribute = (name, value) =>
        ({type: 'mdxJsxAttribute', name, value});

      return {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [attribute('className', 'video-embed')],
        children: [{
          type: 'mdxJsxFlowElement',
          name: 'iframe',
          attributes: [
            ...Object.entries(iframe).map(([name, value]) =>
              attribute(name, value)),
            attribute('allowFullScreen', true),
          ],
          children: [],
        }],
      };
    }

    const attributes = Object.entries(iframe)
        .map(([name, value]) => `${name}="${value}"`)
        .join(' ');

    return {
      type: 'html',
      value: `<div class="video-embed"><iframe ${attributes} allowfullscreen>` +
        '</iframe></div>',
    };
  },
});

/*
 * A paragraph of nothing but images (one, or several on consecutive lines)
 * becomes the images themselves, each a block spanning the full column
 * rather than sitting in a paragraph's narrower measure, as
 * gatsby-remark-images laid them out.
 */
export const unwrapImages = defineMdastPlugin({
  name: 'unwrap-images',
  paragraph(node, ctx) {
    const images = node.children.filter(child => child.type === 'image');
    const onlyImages = images.length > 0 && node.children.every(child =>
      child.type === 'image' ||
      (child.type === 'text' && !child.value.trim()));

    if (onlyImages) {
      ctx.replaceNode(node, images);
    }
  },
});

const NOTE_COMPONENTS = new Set(['StickyNote', 'StickyStack']);

function isNote(node) {
  return node?.type === 'mdxJsxFlowElement' && NOTE_COMPONENTS.has(node.name);
}

/*
 * Sticky notes are written just before the block they annotate, so that on
 * wide screens they float beside it from its first line. On a phone there is
 * no room beside it, and a note sitting above the block reads before the
 * thing it comments on. Wrapping each note (or run of consecutive notes)
 * together with the block after it lets CSS swap the two there, while the
 * wrapper steps out of the layout (display: contents) everywhere else so the
 * float behaves exactly as if it weren't there. See .stickyPair in
 * content.scss. Notes only exist in MDX, so this skips plain Markdown.
 */
function stickyPairsPlugin() {
  const done = new WeakSet();

  return defineMdastPlugin({
    name: 'sticky-pairs',
    mdxJsxFlowElement(node, ctx) {
      const parent = ctx.parent(node);

      if (!isNote(node) || parent?.type !== 'root' || done.has(parent)) {
        return;
      }

      done.add(parent);

      const children = [];
      let index = 0;

      while (index < parent.children.length) {
        if (!isNote(parent.children[index])) {
          children.push(parent.children[index]);
          index += 1;
          continue;
        }

        let end = index;
        while (isNote(parent.children[end])) {
          end += 1;
        }

        if (!parent.children[end]) {
          children.push(...parent.children.slice(index));
          break;
        }

        children.push({
          type: 'sticky-pair',
          data: {hName: 'div', hProperties: {className: ['sticky-pair']}},
          children: parent.children.slice(index, end + 1),
        });
        index = end + 1;
      }

      ctx.setProperty(parent, 'children', children);
    },
  });
}

export const stickyPairs = context =>
  (context.sourceFormat === 'mdx' ? stickyPairsPlugin() : null);

/*
 * :shortcode: emoji, using the same GitHub shortcode names remark-emoji did.
 * Unknown names are left as written, so a colon-delimited word that isn't an
 * emoji comes through untouched. Inline code is its own node type, so
 * shortcodes inside backticks are never visited.
 */
export const emojiShortcodes = defineMdastPlugin({
  name: 'emoji-shortcodes',
  text(node, ctx) {
    if (!node.value.includes(':')) {
      return;
    }

    const value = node.value.replace(
        /:([a-z0-9_+-]+):/g,
        (match, name) => emoji.get(name) || match,
    );

    if (value !== node.value) {
      ctx.setProperty(node, 'value', value);
    }
  },
});

const SITE_HOSTNAME = 'seanmcn.com';

function externalHostname(href) {
  if (typeof href !== 'string') {
    return null;
  }

  let url;
  try {
    url = new URL(href, `https://${SITE_HOSTNAME}`);
  } catch {
    return null;
  }

  if (!/^https?:$/.test(url.protocol)) {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '');
  return hostname === SITE_HOSTNAME ? null : hostname;
}

/*
 * External links open in the same tab with rel="nofollow", and carry the
 * site's favicon for their domain, fetched at build time by
 * scripts/fetch-favicons.mjs (never at request time, so no per-visitor
 * third-party call). A domain the script hasn't seen yet has no icon file,
 * and the <img> removes itself on 404 rather than showing a broken image.
 */
export const externalLinks = defineHastPlugin({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const hostname = externalHostname(node.properties?.href);

      if (!hostname) {
        return;
      }

      const classes = [].concat(node.properties.className || []);
      ctx.setProperty(node, 'className', [...classes, 'external-link']);
      ctx.setProperty(node, 'rel', ['nofollow']);
      ctx.setProperty(node, 'target', '_self');
      ctx.prependChild(node, {
        type: 'element',
        tagName: 'img',
        properties: {
          alt: '',
          className: ['external-link__icon'],
          height: 16,
          loading: 'lazy',
          onError: 'this.remove()',
          src: `/favicons/${hostname}.png`,
          width: 16,
        },
        children: [],
      });
    },
  },
});

/*
 * A post's own images get a set of widths and a sizes hint, so a phone
 * fetches a smaller file than a wide screen does. Astro reads both when it
 * optimises the image, which happens after these plugins, and keeps the
 * full-size file as the plain src. Remote images and the favicons added
 * above are left alone.
 */
export const responsiveImages = defineHastPlugin({
  name: 'responsive-images',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      const src = node.properties?.src;

      if (typeof src !== 'string' || /^([a-z][a-z0-9+.-]*:|\/)/i.test(src)) {
        return;
      }

      ctx.setProperty(node, 'widths', IMAGE_SIZES.prose.widths);
      ctx.setProperty(node, 'sizes', IMAGE_SIZES.prose.sizes);
    },
  },
});
