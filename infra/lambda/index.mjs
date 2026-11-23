// The function's entry point: the handler wired to SES and the settings the
// stack passes in.
import {SESv2Client} from '@aws-sdk/client-sesv2';
import {configFromEnv, createHandler} from './signup.mjs';

export const handler = createHandler({
  ses: new SESv2Client({}),
  config: configFromEnv(process.env),
});
