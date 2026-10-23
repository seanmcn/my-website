/*
 * Emails a published item to everyone subscribed:
 *
 *   npm run email-item -- 2026/10/pi                 # a dry run
 *   npm run email-item -- 2026/10/pi --only me@x.com # send to one subscriber
 *   npm run email-item -- 2026/10/pi --send          # send to everyone
 *
 * The item comes from the live feed, so only what's actually published can
 * be sent. Run without an item to list the newest ones.
 */
import {writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {parseArgs, styleText} from 'node:util';
import {
  GetAccountCommand,
  ListContactsCommand,
  SendEmailCommand,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import {emailInput} from '../lambda/mail.mjs';
import * as settings from '../lib/settings.mjs';
import {findItem, itemEmail, parseFeed} from './item-email.mjs';

const config = {
  fromName: settings.FROM_NAME,
  fromAddress: settings.FROM_ADDRESS,
  replyTo: settings.REPLY_TO,
  contactList: settings.CONTACT_LIST,
  topic: settings.TOPIC,
  configurationSet: settings.CONFIGURATION_SET,
};

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {send: {type: 'boolean'}, only: {type: 'string'}},
});

const response = await fetch(new URL('/rss.xml', settings.SITE_URL));
if (!response.ok) throw new Error(`Fetching the feed: ${response.status}`);
const items = parseFeed(await response.text());

if (positionals.length !== 1) {
  console.log('Usage: npm run email-item -- <slug> [--only <email>] [--send]');
  console.log('\nThe newest items:');
  for (const {title, link, type} of items.slice(0, 8)) {
    const slug = new URL(link).pathname.replace(/^\/library\/|\/$/g, '');
    console.log(`  ${slug.padEnd(48)} ${type.padEnd(5)} ${title}`);
  }
  process.exit(positionals.length ? 1 : 0);
}

const item = findItem(items, positionals[0]);
if (!item) {
  console.error(`No published item matches ${positionals[0]}.`);
  process.exit(1);
}

const ses = new SESv2Client({region: settings.REGION});

async function subscribers() {
  const emails = [];
  let NextToken;

  do {
    const page = await ses.send(new ListContactsCommand({
      ContactListName: settings.CONTACT_LIST,
      Filter: {
        FilteredStatus: 'OPT_IN',
        TopicFilter: {
          TopicName: settings.TOPIC,
          UseDefaultIfPreferenceUnavailable: false,
        },
      },
      PageSize: 1000,
      NextToken,
    }));
    for (const contact of page.Contacts || []) {
      if (!contact.UnsubscribeAll) emails.push(contact.EmailAddress);
    }
    ({NextToken} = page);
  } while (NextToken);

  return emails;
}

let recipients = await subscribers();
if (values.only) {
  const only = values.only.trim().toLowerCase();
  if (!recipients.includes(only)) {
    console.error(`${only} isn't a confirmed subscriber.`);
    process.exit(1);
  }
  recipients = [only];
}

const email = itemEmail(item);
const preview = path.join(tmpdir(), 'email-item-preview.html');
await writeFile(preview, email.html);

console.log(`${styleText('bold', email.subject)}  (${item.type}, ` +
  `${item.date.toDateString()})`);
console.log(`${item.link}\n`);
console.log(email.text);
console.log(`\nPreview: ${preview}`);
console.log(`Recipients: ${recipients.length}`);

if (!values.send && !values.only) {
  console.log('\nA dry run. Add --only <email> to send it to one ' +
    'subscriber, or --send to send it to everyone.');
  process.exit(0);
}

const {SendQuota, ProductionAccessEnabled} =
  await ses.send(new GetAccountCommand({}));
if (!ProductionAccessEnabled) {
  console.log(styleText('yellow', '\nSES is still in the sandbox: only ' +
    'verified addresses will get it.'));
}

// Stays under the account's sending rate, which starts at 1 a second in the
// sandbox.
const gap = 1000 / Math.max(1, SendQuota.MaxSendRate - 1);
const failed = [];

for (const [index, to] of recipients.entries()) {
  try {
    await ses.send(new SendEmailCommand(emailInput(config, {
      to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      list: true,
    })));
  } catch (error) {
    failed.push([to, error.message]);
  }
  process.stdout.write(`\rSent ${index + 1 - failed.length} of ` +
    `${recipients.length}`);
  await new Promise(resolve => setTimeout(resolve, gap));
}

console.log('');
for (const [to, message] of failed) {
  console.error(styleText('red', `Failed: ${to}: ${message}`));
}
process.exit(failed.length ? 1 : 0);
