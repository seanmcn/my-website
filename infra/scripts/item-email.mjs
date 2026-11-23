/*
 * Reading items out of the site's RSS feed, and the email that announces one.
 * The feed is the site's own (src/pages/rss.xml.js), so a few patterns are
 * enough to read it.
 */
import {escapeHtml, htmlBody} from '../lambda/mail.mjs';

const ENTITIES = {amp: '&', lt: '<', gt: '>', quot: '"', apos: '\''};

function decode(text) {
  return text
      .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')
      .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, name) => {
        if (name[0] !== '#') return ENTITIES[name] ?? entity;
        return String.fromCodePoint(name[1] === 'x' || name[1] === 'X' ?
          parseInt(name.slice(2), 16) :
          parseInt(name.slice(1), 10));
      });
}

function field(item, name) {
  const match = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));

  return match ? decode(match[1]) : '';
}

// Newest first, as the feed lists them.
export function parseFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: field(item, 'title'),
    link: field(item, 'link'),
    description: field(item, 'description'),
    type: field(item, 'category'),
    date: new Date(field(item, 'pubDate')),
  }));
}

// `2026/10/pi`, `/library/2026/10/pi/` or the item's full address.
export function findItem(items, wanted) {
  const slug = wanted
      .replace(/^https?:\/\/[^/]+/, '')
      .replace(/^\/?(library\/)?/, '')
      .replace(/\/$/, '');

  return items.find(({link}) => new URL(link).pathname === `/library/${slug}/`);
}

export function itemEmail(item) {
  const unsubscribe = '{{amazonSESUnsubscribeUrl}}';
  const footer = 'You\'re getting this because you subscribed at ' +
    'seanmcn.com.';

  return {
    subject: item.title,
    text: [
      item.title,
      item.description,
      `Read it on seanmcn.com: ${item.link}`,
      '--',
      `${footer} Unsubscribe: ${unsubscribe}`,
    ].join('\n\n'),
    html: htmlBody([
      `<a href="${escapeHtml(item.link)}" style="font-size:22px;` +
        `font-weight:bold;color:#0b6b57;">${escapeHtml(item.title)}</a>`,
      escapeHtml(item.description),
      `<a href="${escapeHtml(item.link)}" style="color:#0b6b57;">` +
        'Read it on seanmcn.com →</a>',
    ], [
      `${footer} <a href="${unsubscribe}">Unsubscribe</a>.`,
    ]),
  };
}
