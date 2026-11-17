import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {findItem, itemEmail, parseFeed} from '../scripts/item-email.mjs';

// Shaped like the site's feed, entities and all.
const FEED = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0">' +
  '<channel><title>Seanmcn.com RSS feed</title>' +
  '<item><title>AI&apos;s Environmental Impact</title>' +
  '<link>https://seanmcn.com/library/2026/10/ai-environmental-impact/</link>' +
  '<description>Training &amp; prompts &lt;compared&gt; &#8212; ' +
  'roughly &#x2014; done.</description>' +
  '<pubDate>Sat, 17 Oct 2026 00:00:00 GMT</pubDate>' +
  '<content:encoded>&lt;p&gt;Body&lt;/p&gt;</content:encoded>' +
  '<category>post</category></item>' +
  '<item><title><![CDATA[Pi & friends]]></title>' +
  '<link>https://seanmcn.com/library/2026/10/pi/</link>' +
  '<description>A coding agent.</description>' +
  '<pubDate>Sun, 18 Oct 2026 00:00:00 GMT</pubDate>' +
  '<category>find</category></item>' +
  '</channel></rss>';

describe('item emails', () => {
  const items = parseFeed(FEED);

  it('reads each item from the feed', () => {
    assert.equal(items.length, 2);
    assert.deepEqual(items[0], {
      title: 'AI\'s Environmental Impact',
      link: 'https://seanmcn.com/library/2026/10/ai-environmental-impact/',
      description: 'Training & prompts <compared> — roughly — done.',
      type: 'post',
      date: new Date('2026-10-17T00:00:00Z'),
    });
    assert.equal(items[1].title, 'Pi & friends');
  });

  it('finds an item by slug, path or address', () => {
    for (const wanted of [
      '2026/10/pi',
      '2026/10/pi/',
      '/library/2026/10/pi/',
      'https://seanmcn.com/library/2026/10/pi/',
    ]) {
      assert.equal(findItem(items, wanted)?.title, 'Pi & friends', wanted);
    }
    assert.equal(findItem(items, '2026/10'), undefined);
  });

  it('escapes the item in the HTML and links an unsubscribe', () => {
    const email = itemEmail(items[0]);

    assert.equal(email.subject, 'AI\'s Environmental Impact');
    assert.match(email.html, /Training &amp; prompts &lt;compared&gt;/);
    assert.ok(email.html.includes(`href="${items[0].link}"`));
    assert.match(email.html, /<a href="{{amazonSESUnsubscribeUrl}}">/);
    assert.match(email.text, /Unsubscribe: {{amazonSESUnsubscribeUrl}}/);
    assert.match(email.text, /Read it on seanmcn.com: https:\/\/seanmcn.com\//);
  });
});
