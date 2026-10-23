import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {App} from 'aws-cdk-lib';
import {Match, Template} from 'aws-cdk-lib/assertions';
import {SubscriptionsStack} from '../lib/subscriptions-stack.mjs';

const template = Template.fromStack(new SubscriptionsStack(new App(), 'Test', {
  env: {account: '123456789012', region: 'eu-west-2'},
  hostedZoneId: 'Z0000000000TEST',
}));

describe('subscriptions stack', () => {
  it('sends from news.seanmcn.com with DKIM and its own MAIL FROM', () => {
    template.hasResourceProperties('AWS::SES::EmailIdentity', {
      EmailIdentity: 'news.seanmcn.com',
      MailFromAttributes: {MailFromDomain: 'mail.news.seanmcn.com'},
      ConfigurationSetAttributes: {ConfigurationSetName: Match.anyValue()},
    });

    const records = Object.values(
        template.findResources('AWS::Route53::RecordSet'))
        .map(({Properties}) => Properties);
    assert.equal(records.filter(({Type}) => Type === 'CNAME').length, 3);
    assert.ok(records.every(({HostedZoneId}) => HostedZoneId ===
      'Z0000000000TEST'));
    assert.deepEqual(
        records.filter(({Type}) => Type === 'TXT').map(r => r.ResourceRecords),
        [['"v=spf1 include:amazonses.com ~all"']]);
  });

  it('never sends again to addresses that bounce or complain', () => {
    template.hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {SuppressedReasons: ['BOUNCE', 'COMPLAINT']},
    });
  });

  it('keeps subscribers opted out until they confirm, and the list kept', () => {
    template.hasResource('AWS::SES::ContactList', {
      DeletionPolicy: 'Retain',
      Properties: {
        ContactListName: 'seanmcn-com',
        Topics: [Match.objectLike({
          TopicName: 'new-items',
          DefaultSubscriptionStatus: 'OPT_OUT',
        })],
      },
    });
  });

  it('lets the signup function touch only the list and its own mail', () => {
    const [policy] = Object.values(template.findResources('AWS::IAM::Policy'));
    const statements = policy.Properties.PolicyDocument.Statement;

    assert.deepEqual(statements.map(({Action}) => Action), [
      ['ses:GetContact', 'ses:CreateContact', 'ses:UpdateContact'],
      'ses:SendEmail',
    ]);
    assert.ok(statements.every(({Resource}) => Resource !== '*'));
  });

  it('takes form posts on subscribe.seanmcn.com only, throttled', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      DisableExecuteApiEndpoint: true,
    });
    template.hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'subscribe.seanmcn.com',
    });
    template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      StageName: '$default',
      DefaultRouteSettings: {ThrottlingRateLimit: 5, ThrottlingBurstLimit: 10},
    });
    template.resourceCountIs('AWS::ApiGatewayV2::Route', 2);
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'POST /subscribe',
    });
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'POST /confirm',
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'subscribe.seanmcn.com.',
      Type: 'A',
    });
  });

  it('runs the signup function on Node 24', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs24.x',
      Handler: 'index.handler',
    });
  });
});
