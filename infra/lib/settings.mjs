/*
 * Names shared by the stack, which hands them to the signup function as
 * environment variables, and the script that emails an item to subscribers.
 */

export const REGION = 'eu-west-2';

export const DOMAIN = 'seanmcn.com';
export const SITE_URL = 'https://seanmcn.com';

// Browsers posting the signup form from anywhere else are turned away. The
// dev server and Playwright's preview are let in by the function itself.
export const SITE_ORIGINS = ['https://seanmcn.com', 'https://develop.seanmcn.com'];

// Mail goes out from a subdomain, so a problem with the list can't harm the
// reputation of the personal mail that Purelymail sends for seanmcn.com.
export const SENDING_DOMAIN = 'news.seanmcn.com';
export const MAIL_FROM_DOMAIN = `mail.${SENDING_DOMAIN}`;
export const FROM_ADDRESS = `posts@${SENDING_DOMAIN}`;
export const FROM_NAME = 'Seán McNamara';
export const REPLY_TO = 'me@seanmcn.com';

// Where the signup form posts.
export const API_DOMAIN = 'subscribe.seanmcn.com';

export const CONTACT_LIST = 'seanmcn-com';
export const TOPIC = 'new-items';
export const CONFIGURATION_SET = 'seanmcn-com';
