/*
 * The two form posts behind email subscriptions, behind an HTTP API:
 *
 *   POST /subscribe  emails a confirmation link to the address given
 *   POST /confirm    the button on the page that link opens
 *
 * Everyone is kept in the SES contact list. Until they confirm, a contact is
 * opted out of the topic, so nothing can be sent to them, and carries the
 * token from their confirmation link in its attributes. The link opens a page
 * with a button rather than confirming on its own, because mail scanners open
 * links to check them.
 *
 * Both routes answer with a redirect to a page on the site that posted, so the
 * form works without JavaScript.
 */
import {randomBytes, timingSafeEqual} from 'node:crypto';
import {
  CreateContactCommand,
  GetContactCommand,
  SendEmailCommand,
  UpdateContactCommand,
} from '@aws-sdk/client-sesv2';
import {emailInput, escapeHtml, htmlBody} from './mail.mjs';

// One email per address in this long, however often the form is sent.
const RESEND_AFTER_MS = 15 * 60 * 1000;
const LINK_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PAGES = {
  checkInbox: '/subscribe/check-your-inbox/',
  confirm: '/subscribe/confirm/',
  confirmed: '/subscribe/confirmed/',
  expired: '/subscribe/link-expired/',
  problem: '/subscribe/problem/',
};

export function configFromEnv(env) {
  return {
    siteOrigins: env.SITE_ORIGINS.split(','),
    fromName: env.FROM_NAME,
    fromAddress: env.FROM_ADDRESS,
    replyTo: env.REPLY_TO,
    contactList: env.CONTACT_LIST,
    topic: env.TOPIC,
    configurationSet: env.CONFIGURATION_SET,
  };
}

function redirect(origin, path) {
  return {statusCode: 303, headers: {location: new URL(path, origin).href}};
}

function readForm(event) {
  const body = event.isBase64Encoded ?
    Buffer.from(event.body || '', 'base64').toString('utf8') :
    event.body || '';

  return new URLSearchParams(body);
}

function readAttributes(contact) {
  try {
    return JSON.parse(contact.AttributesData || '{}');
  } catch {
    return {};
  }
}

function sameToken(given, expected) {
  const a = Buffer.from(given || '');
  const b = Buffer.from(expected || '');

  return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export function createHandler({
  ses,
  config,
  now = () => Date.now(),
  newToken = () => randomBytes(24).toString('base64url'),
}) {
  const list = {ContactListName: config.contactList};
  const optIn = status => [
    {TopicName: config.topic, SubscriptionStatus: status},
  ];

  function isSubscribed(contact) {
    const topic = (contact.TopicPreferences || [])
        .find(({TopicName}) => TopicName === config.topic);

    return !contact.UnsubscribeAll && topic?.SubscriptionStatus === 'OPT_IN';
  }

  async function getContact(email) {
    try {
      return await ses.send(new GetContactCommand({
        ...list,
        EmailAddress: email,
      }));
    } catch (error) {
      if (error.name === 'NotFoundException') return null;
      throw error;
    }
  }

  function sendConfirmation(email, link) {
    const text = [
      'Hi,',
      'Someone, hopefully you, asked for an email whenever something new ' +
        'goes up on seanmcn.com. To confirm, open this link and press the ' +
        'button:',
      link,
      'If it wasn\'t you, ignore this email and you won\'t hear from me again.',
      'Seán',
    ].join('\n\n');
    const html = htmlBody([
      'Hi,',
      'Someone, hopefully you, asked for an email whenever something new ' +
        'goes up on seanmcn.com. To confirm, open this link and press the ' +
        'button:',
      `<a href="${escapeHtml(link)}" style="color:#0b6b57;">` +
        'Confirm your subscription</a>',
      'If it wasn&#39;t you, ignore this email and you won&#39;t hear from ' +
        'me again.',
      'Seán',
    ]);

    return ses.send(new SendEmailCommand(emailInput(config, {
      to: email,
      subject: 'Confirm your subscription to seanmcn.com',
      text,
      html,
    })));
  }

  // Sent on the contact list, so it carries a working unsubscribe link.
  function sendAlreadySubscribed(email) {
    const message = 'This address already gets an email whenever something ' +
      'new goes up on seanmcn.com, so there\'s nothing more to do.';
    const unsubscribe = 'Changed your mind? Unsubscribe here:';

    return ses.send(new SendEmailCommand(emailInput(config, {
      to: email,
      subject: 'You\'re already subscribed to seanmcn.com',
      text: [message, 'Seán', '--',
        `${unsubscribe} {{amazonSESUnsubscribeUrl}}`].join('\n\n'),
      html: htmlBody([escapeHtml(message), 'Seán'],
          ['Changed your mind? <a href="{{amazonSESUnsubscribeUrl}}">' +
            'Unsubscribe</a>.']),
      list: true,
    })));
  }

  async function subscribe(form, origin) {
    // A field people can't see, so only bots fill it in. They get the same
    // answer as everyone else.
    if (form.get('website')) return redirect(origin, PAGES.checkInbox);

    const email = (form.get('email') || '').trim().toLowerCase();
    if (email.length > 254 || !EMAIL.test(email)) {
      return redirect(origin, PAGES.problem);
    }

    const contact = await getContact(email);
    const attributes = contact ? readAttributes(contact) : {};
    if (attributes.sentAt && now() - attributes.sentAt < RESEND_AFTER_MS) {
      return redirect(origin, PAGES.checkInbox);
    }

    if (contact && isSubscribed(contact)) {
      await ses.send(new UpdateContactCommand({
        ...list,
        EmailAddress: email,
        TopicPreferences: optIn('OPT_IN'),
        UnsubscribeAll: false,
        AttributesData: JSON.stringify({...attributes, sentAt: now()}),
      }));
      await sendAlreadySubscribed(email);

      return redirect(origin, PAGES.checkInbox);
    }

    const token = newToken();
    const pending = {
      ...list,
      EmailAddress: email,
      TopicPreferences: optIn('OPT_OUT'),
      UnsubscribeAll: false,
      AttributesData: JSON.stringify({token, sentAt: now()}),
    };
    await ses.send(contact ?
      new UpdateContactCommand(pending) :
      new CreateContactCommand(pending));

    const link = new URL(PAGES.confirm, origin);
    link.searchParams.set('email', email);
    link.searchParams.set('token', token);
    await sendConfirmation(email, link.href);

    return redirect(origin, PAGES.checkInbox);
  }

  async function confirm(form, origin) {
    const email = (form.get('email') || '').trim().toLowerCase();
    const contact = email ? await getContact(email) : null;
    if (!contact) return redirect(origin, PAGES.expired);

    // Pressing the button twice, or opening the link again, is fine.
    if (isSubscribed(contact)) return redirect(origin, PAGES.confirmed);

    const attributes = readAttributes(contact);
    const fresh = now() - (attributes.sentAt || 0) < LINK_LIFETIME_MS;
    if (!fresh || !sameToken(form.get('token'), attributes.token)) {
      return redirect(origin, PAGES.expired);
    }

    await ses.send(new UpdateContactCommand({
      ...list,
      EmailAddress: email,
      TopicPreferences: optIn('OPT_IN'),
      UnsubscribeAll: false,
      AttributesData: JSON.stringify({
        confirmedAt: now(),
        sentAt: attributes.sentAt,
      }),
    }));

    return redirect(origin, PAGES.confirmed);
  }

  return async function handler(event) {
    const method = event.requestContext?.http?.method;
    const origin = event.headers?.origin;
    const route = {'/subscribe': subscribe, '/confirm': confirm}[event.rawPath];

    if (method !== 'POST' || !route) {
      return {statusCode: 404, body: 'Not found'};
    }
    if (!config.siteOrigins.includes(origin) && !LOCAL_ORIGIN.test(origin)) {
      return {statusCode: 403, body: 'Forbidden'};
    }

    try {
      return await route(readForm(event), origin);
    } catch (error) {
      console.error(error);

      return redirect(origin, PAGES.problem);
    }
  };
}
