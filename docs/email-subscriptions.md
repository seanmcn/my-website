# Email subscriptions

Readers can sign up for an email whenever an item is published. Amazon SES
sends the mail and keeps the subscribers. The AWS side lives in `infra/`, a
CDK app with its own `package.json`, so the Amplify build never installs it.

## How it works

1. The form at the end of every item, and on `/subscribe/`, posts the address
   to `https://subscribe.seanmcn.com/subscribe`. That's an API Gateway HTTP
   API in front of one Lambda function, `infra/lambda/signup.mjs`.
2. The function adds the address to the SES contact list, opted out of the
   `new-items` topic so nothing can be sent to it yet. It stores a random
   token in the contact's attributes and emails a link to
   `/subscribe/confirm/?email=…&token=…`.
3. That page has a button that posts the address and token to `/confirm`. If
   the token matches and is under a week old, the contact is opted in. A
   button is needed because mail scanners open every link in an email to
   check it, which would confirm people who never clicked.
4. `npm run email-item` in `infra/` emails a published item to everyone
   opted in. SES adds the unsubscribe link and the one-click
   `List-Unsubscribe` headers Gmail and Yahoo require, and records anyone who
   unsubscribes.

Each post to the API is answered with a redirect to a page under
`/subscribe/`, so the forms work without JavaScript. The confirm page is the
exception: a short script copies the address and token from its link into
the form.

| Page                           | Shown after                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| `/subscribe/check-your-inbox/` | Any signup, including from someone already subscribed           |
| `/subscribe/confirmed/`        | Confirming, or pressing the button again                        |
| `/subscribe/link-expired/`     | A wrong or week-old token, or an address that isn't on the list |
| `/subscribe/problem/`          | A malformed address, or SES failing                             |

The pages after a form post are `noindex` and left out of the sitemap.

Someone who signs up again while subscribed gets a short "you're already
subscribed" email rather than a second confirmation. Either way, an address
gets at most one email from the form every 15 minutes, so the form can't be
used to flood someone's inbox. The API turns away posts from other sites'
pages (by their `Origin` header) and is throttled to 5 requests a second. A
hidden `website` field catches bots that fill in everything.

Mail goes out from `posts@news.seanmcn.com`, with replies to
`me@seanmcn.com`. The subdomain keeps the list's sending reputation apart
from the personal mail Purelymail sends for `seanmcn.com`. Purelymail's terms
don't allow mailing lists, so it can't send these.

## What's in the stack

`infra/lib/subscriptions-stack.mjs`, deployed to `eu-west-2` as
`SeanmcnSubscriptions`:

- An SES identity for `news.seanmcn.com`, with Easy DKIM and a MAIL FROM
  domain of `mail.news.seanmcn.com`. CDK writes all of their DNS records into
  the `seanmcn.com` Route 53 zone.
- A configuration set that suppresses addresses that bounce or complain.
- The `seanmcn-com` contact list and its `new-items` topic. The list is kept
  if the stack is deleted.
- The signup function, allowed only to read and write contacts on that list
  and send from that identity.
- The HTTP API on `subscribe.seanmcn.com`, with its certificate and DNS
  record. Its `execute-api` address is turned off.

Names shared by the stack and the scripts are in `infra/lib/settings.mjs`.
The site's copy of the API address is in `src/lib/subscriptions.js`.

## Deploying

The stack goes in the AWS account that holds the `seanmcn.com` hosted zone.
Always name the profile; in any other account the hosted zone lookup fails
before anything is created.

```bash
cd infra
npm ci
npx cdk bootstrap --profile seanmcn   # once per account and region
npx cdk deploy --profile seanmcn
```

The first deploy writes `infra/cdk.context.json` with the hosted zone it
found. Commit it, so later deploys don't look it up again.

The certificate and the DKIM records take a few minutes to validate. Check
with `aws sesv2 get-email-identity --email-identity news.seanmcn.com --profile
seanmcn --region eu-west-2`, which should show `"VerifiedForSendingStatus":
true`.

### Leaving the SES sandbox

A new SES account starts in the sandbox: it can only send to addresses it has
verified, at most 200 a day. Test there first:

```bash
aws sesv2 create-email-identity --email-identity you@example.com \
  --profile seanmcn --region eu-west-2
```

Click the link AWS emails you, then sign up with that address on
develop.seanmcn.com and run `npm run email-item -- <slug> --only
you@example.com`.

Then request production access from the SES console (Account dashboard →
Request production access) in `eu-west-2`. Choose **Marketing** as the mail
type and `https://seanmcn.com/subscribe/` as the website, and describe the use
case:

> I run a personal blog at seanmcn.com. Readers can sign up with a form on
> each post (https://seanmcn.com/subscribe/) to get an email when I publish
> something new, a handful of times a month at most. Signup is double opt-in: the
> form sends a confirmation email, and an address only joins the list once
> its owner presses the confirm button on the page that email links to.
> Unconfirmed addresses are never mailed again. Every email is sent with SES
> subscription management, so it carries an unsubscribe link and the one-click
> List-Unsubscribe header, and SES records unsubscribes. A configuration set
> with bounce and complaint suppression is the default for the sending
> identity. I expect a few hundred recipients at most, and I send each email
> by hand with a script, never to bought or scraped lists.

AWS usually answers within a day. If it asks for more detail, answer the
question it asks rather than resubmitting.

## Emailing an item

Once an item is live on seanmcn.com:

```bash
cd infra
AWS_PROFILE=seanmcn npm run email-item                         # the newest items
AWS_PROFILE=seanmcn npm run email-item -- 2026/10/pi           # a dry run
AWS_PROFILE=seanmcn npm run email-item -- 2026/10/pi --only me@seanmcn.com
AWS_PROFILE=seanmcn npm run email-item -- 2026/10/pi --send    # everyone
```

The item is read from the live feed, so an unpublished one can't be sent.
The dry run prints the email, writes an HTML preview to the temp directory
and counts the recipients. `--only` sends to one confirmed subscriber, which
is the way to check an email before sending it to everyone. Nothing records
what's been sent, so check before sending an item twice.

## Testing

```bash
cd infra && npm test
```

`infra/test/` covers the signup function against an in-memory SES, the item
email and feed parsing, and the synthesised stack. CI runs them after the
site's unit tests. `tests/e2e/subscribe.spec.js` checks what the site's forms
post, standing in for the API.

## Costs

Next to nothing at this size. SES charges $0.10 per 1,000 emails, and the
API, the function and the logs stay inside AWS's free allowances.

## When something goes wrong

The signup function logs SES errors to CloudWatch, in the log group named
after its `SignupLogs` resource, which keeps them for a month. A post that
fails lands on `/subscribe/problem/`.
