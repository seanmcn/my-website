import assert from 'node:assert/strict';
import {beforeEach, describe, it} from 'node:test';
import {configFromEnv, createHandler, PAGES} from '../lambda/signup.mjs';

const config = configFromEnv({
  SITE_ORIGINS: 'https://seanmcn.com,https://develop.seanmcn.com',
  FROM_NAME: 'Seán McNamara',
  FROM_ADDRESS: 'posts@news.seanmcn.com',
  REPLY_TO: 'me@seanmcn.com',
  CONTACT_LIST: 'seanmcn-com',
  TOPIC: 'new-items',
  CONFIGURATION_SET: 'seanmcn-com',
});

const SITE = 'https://seanmcn.com';
const MINUTE = 60 * 1000;

/*
 * Just enough of the SES contact list and SendEmail to run the handler
 * against: contacts by address, and every email it sends.
 */
function fakeSes() {
  const contacts = new Map();
  const sent = [];
  const store = input => contacts.set(input.EmailAddress, structuredClone({
    TopicPreferences: input.TopicPreferences,
    UnsubscribeAll: input.UnsubscribeAll,
    AttributesData: input.AttributesData,
  }));

  return {
    contacts,
    sent,
    async send(command) {
      const input = command.input;

      switch (command.constructor.name) {
        case 'GetContactCommand': {
          const contact = contacts.get(input.EmailAddress);
          if (!contact) {
            throw Object.assign(new Error('missing'), {name: 'NotFoundException'});
          }
          return structuredClone(contact);
        }
        case 'CreateContactCommand':
          assert.ok(!contacts.has(input.EmailAddress), 'contact exists');
          return store(input);
        case 'UpdateContactCommand':
          assert.ok(contacts.has(input.EmailAddress), 'no such contact');
          return store(input);
        case 'SendEmailCommand':
          return sent.push(input);
        default:
          throw new Error(`unexpected ${command.constructor.name}`);
      }
    },
  };
}

function post(path, fields, {origin = SITE, base64 = false} = {}) {
  const body = new URLSearchParams(fields).toString();

  return {
    rawPath: path,
    requestContext: {http: {method: 'POST'}},
    headers: origin ? {origin} : {},
    body: base64 ? Buffer.from(body).toString('base64') : body,
    isBase64Encoded: base64,
  };
}

const attributes = contact => JSON.parse(contact.AttributesData);
const status = contact => contact.TopicPreferences[0].SubscriptionStatus;
const linkIn = email => email.Content.Simple.Body.Text.Data
    .match(/https?:\/\/\S+/)[0];

describe('signup handler', () => {
  let ses;
  let clock;
  let handler;

  beforeEach(() => {
    ses = fakeSes();
    clock = Date.parse('2026-10-23T12:00:00Z');
    let tokens = 0;
    handler = createHandler({
      ses,
      config,
      now: () => clock,
      newToken: () => `token-${++tokens}`,
    });
  });

  async function subscribe(email, options) {
    return handler(post('/subscribe', {email}, options));
  }

  async function confirmFromEmail(index = ses.sent.length - 1) {
    const link = new URL(linkIn(ses.sent[index]));

    return handler(post('/confirm', Object.fromEntries(link.searchParams)));
  }

  it('emails a confirmation link and keeps the address opted out', async () => {
    const response = await subscribe('  Reader@Example.com ');

    assert.equal(response.statusCode, 303);
    assert.equal(response.headers.location, `${SITE}${PAGES.checkInbox}`);

    const contact = ses.contacts.get('reader@example.com');
    assert.equal(status(contact), 'OPT_OUT');
    assert.equal(attributes(contact).token, 'token-1');

    assert.equal(ses.sent.length, 1);
    const [email] = ses.sent;
    assert.deepEqual(email.Destination.ToAddresses, ['reader@example.com']);
    assert.equal(email.ListManagementOptions, undefined);
    assert.equal(email.FromEmailAddress,
        '=?UTF-8?B?U2XDoW4gTWNOYW1hcmE=?= <posts@news.seanmcn.com>');
    assert.equal(linkIn(email), `${SITE}${PAGES.confirm}` +
      '?email=reader%40example.com&token=token-1');
  });

  it('subscribes the address when the confirm button is pressed', async () => {
    await subscribe('reader@example.com');
    const response = await confirmFromEmail();

    assert.equal(response.headers.location, `${SITE}${PAGES.confirmed}`);
    const contact = ses.contacts.get('reader@example.com');
    assert.equal(status(contact), 'OPT_IN');
    assert.equal(attributes(contact).token, undefined);
  });

  it('treats a second press of the button as confirmed', async () => {
    await subscribe('reader@example.com');
    await confirmFromEmail();
    const response = await confirmFromEmail();

    assert.equal(response.headers.location, `${SITE}${PAGES.confirmed}`);
  });

  it('turns away a wrong token', async () => {
    await subscribe('reader@example.com');
    const response = await handler(post('/confirm', {
      email: 'reader@example.com',
      token: 'token-2',
    }));

    assert.equal(response.headers.location, `${SITE}${PAGES.expired}`);
    assert.equal(status(ses.contacts.get('reader@example.com')), 'OPT_OUT');
  });

  it('turns away a link older than a week', async () => {
    await subscribe('reader@example.com');
    clock += 8 * 24 * 60 * MINUTE;
    const response = await confirmFromEmail();

    assert.equal(response.headers.location, `${SITE}${PAGES.expired}`);
    assert.equal(status(ses.contacts.get('reader@example.com')), 'OPT_OUT');
  });

  it('turns away a confirmation for an unknown address', async () => {
    const response = await handler(post('/confirm', {
      email: 'nobody@example.com',
      token: 'token-1',
    }));

    assert.equal(response.headers.location, `${SITE}${PAGES.expired}`);
  });

  it('sends one email per address every 15 minutes at most', async () => {
    await subscribe('reader@example.com');
    clock += 5 * MINUTE;
    await subscribe('reader@example.com');
    assert.equal(ses.sent.length, 1);

    clock += 11 * MINUTE;
    await subscribe('reader@example.com');
    assert.equal(ses.sent.length, 2);

    // Only the newest link works.
    assert.equal((await confirmFromEmail(0)).headers.location,
        `${SITE}${PAGES.expired}`);
    assert.equal((await confirmFromEmail(1)).headers.location,
        `${SITE}${PAGES.confirmed}`);
  });

  it('tells a subscriber they are already subscribed', async () => {
    await subscribe('reader@example.com');
    await confirmFromEmail();
    clock += 20 * MINUTE;
    const response = await subscribe('reader@example.com');

    assert.equal(response.headers.location, `${SITE}${PAGES.checkInbox}`);
    assert.equal(ses.sent.length, 2);
    const notice = ses.sent[1];
    assert.match(notice.Content.Simple.Subject.Data, /already subscribed/);
    assert.deepEqual(notice.ListManagementOptions,
        {ContactListName: 'seanmcn-com', TopicName: 'new-items'});
    assert.match(notice.Content.Simple.Body.Html.Data,
        /{{amazonSESUnsubscribeUrl}}/);
    assert.equal(status(ses.contacts.get('reader@example.com')), 'OPT_IN');
  });

  it('lets someone who unsubscribed sign up again', async () => {
    await subscribe('reader@example.com');
    await confirmFromEmail();
    // What SES does when they press the unsubscribe link.
    const contact = ses.contacts.get('reader@example.com');
    contact.TopicPreferences[0].SubscriptionStatus = 'OPT_OUT';

    clock += 20 * MINUTE;
    await subscribe('reader@example.com');
    assert.match(ses.sent[1].Content.Simple.Subject.Data, /Confirm/);
    await confirmFromEmail();
    assert.equal(status(ses.contacts.get('reader@example.com')), 'OPT_IN');
  });

  it('quietly ignores the hidden field bots fill in', async () => {
    const response = await handler(post('/subscribe', {
      email: 'reader@example.com',
      website: 'https://spam.example',
    }));

    assert.equal(response.headers.location, `${SITE}${PAGES.checkInbox}`);
    assert.equal(ses.contacts.size, 0);
    assert.equal(ses.sent.length, 0);
  });

  it('sends a malformed address to the problem page', async () => {
    for (const email of ['', 'not-an-email', `${'a'.repeat(250)}@x.co`]) {
      const response = await subscribe(email);
      assert.equal(response.headers.location, `${SITE}${PAGES.problem}`);
    }
    assert.equal(ses.sent.length, 0);
  });

  it('refuses posts from other sites', async () => {
    for (const origin of ['https://evil.example', null]) {
      const response = await subscribe('reader@example.com', {origin});
      assert.equal(response.statusCode, 403);
    }
    assert.equal(ses.contacts.size, 0);
  });

  it('sends people back to the site they signed up on', async () => {
    const origin = 'http://localhost:4321';
    const response = await subscribe('reader@example.com', {origin});

    assert.equal(response.headers.location, `${origin}${PAGES.checkInbox}`);
    assert.ok(linkIn(ses.sent[0]).startsWith(`${origin}${PAGES.confirm}`));
  });

  it('reads a base64-encoded body', async () => {
    await subscribe('reader@example.com', {base64: true});

    assert.ok(ses.contacts.has('reader@example.com'));
  });

  it('answers anything else with a 404', async () => {
    const get = {...post('/subscribe', {}), requestContext: {http: {method: 'GET'}}};

    assert.equal((await handler(get)).statusCode, 404);
    assert.equal((await handler(post('/other', {}))).statusCode, 404);
  });

  it('sends people to the problem page when SES fails', async () => {
    const broken = createHandler({
      ses: {send: async () => {
        throw new Error('throttled');
      }},
      config,
    });
    const error = console.error;
    console.error = () => {};
    try {
      const response = await broken(post('/subscribe', {email: 'a@b.co'}));
      assert.equal(response.headers.location, `${SITE}${PAGES.problem}`);
    } finally {
      console.error = error;
    }
  });
});
