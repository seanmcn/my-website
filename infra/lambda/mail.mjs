/*
 * Builds the SES SendEmail input for every email the site sends: the
 * confirmation, the already-subscribed notice and each item.
 */

// SES wants a display name outside ASCII (the á in Seán) as a MIME encoded
// word, or it rejects the address.
export function fromHeader(name, address) {
  const encoded = Buffer.from(name, 'utf8').toString('base64');

  return `=?UTF-8?B?${encoded}?= <${address}>`;
}

export function escapeHtml(text) {
  return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

/*
 * One plain layout for every email: paragraphs of text, then an optional
 * footer in smaller type. Paragraphs are given as HTML, already escaped.
 */
export function htmlBody(paragraphs, footer = []) {
  const p = 'margin:0 0 16px;';
  const small = 'margin:0 0 8px;font-size:13px;color:#555;';

  return [
    '<!doctype html>',
    '<html lang="en"><head><meta charset="utf-8"></head>',
    '<body style="margin:0;padding:24px;font-family:Georgia,serif;' +
      'font-size:17px;line-height:1.5;color:#1a1a1a;background:#fff;">',
    '<div style="max-width:560px;margin:0 auto;">',
    ...paragraphs.map(html => `<p style="${p}">${html}</p>`),
    ...(footer.length ?
      ['<hr style="border:0;border-top:1px solid #ddd;margin:24px 0;">'] :
      []),
    ...footer.map(html => `<p style="${small}">${html}</p>`),
    '</div></body></html>',
  ].join('\n');
}

/*
 * With a contact list given, SES fills in {{amazonSESUnsubscribeUrl}}, adds
 * the one-click List-Unsubscribe headers and refuses to send to anyone who
 * has unsubscribed.
 */
export function emailInput(config, {to, subject, text, html, list = false}) {
  const utf8 = Data => ({Data, Charset: 'UTF-8'});

  return {
    FromEmailAddress: fromHeader(config.fromName, config.fromAddress),
    ReplyToAddresses: [config.replyTo],
    Destination: {ToAddresses: [to]},
    ConfigurationSetName: config.configurationSet,
    Content: {
      Simple: {
        Subject: utf8(subject),
        Body: {Text: utf8(text), Html: utf8(html)},
      },
    },
    ...(list && {
      ListManagementOptions: {
        ContactListName: config.contactList,
        TopicName: config.topic,
      },
    }),
  };
}
