// The CDK app: one stack, in the account of whichever AWS profile deploys it.
import {App} from 'aws-cdk-lib';
import {SubscriptionsStack} from '../lib/subscriptions-stack.mjs';
import {REGION} from '../lib/settings.mjs';

const app = new App();

new SubscriptionsStack(app, 'SeanmcnSubscriptions', {
  env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: REGION},
  hostedZoneId: app.node.tryGetContext('hostedZoneId'),
});
