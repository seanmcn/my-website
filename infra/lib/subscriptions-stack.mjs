/*
 * Email subscriptions: SES sends from news.seanmcn.com and keeps the
 * subscribers in a contact list, and a small HTTP API on
 * subscribe.seanmcn.com takes the site's signup and confirm form posts.
 */
import {fileURLToPath} from 'node:url';
import {CfnOutput, Duration, RemovalPolicy, Stack} from 'aws-cdk-lib';
import {DomainName, HttpApi, HttpMethod} from 'aws-cdk-lib/aws-apigatewayv2';
import {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {Architecture, Code, Function, Runtime} from 'aws-cdk-lib/aws-lambda';
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs';
import {ARecord, HostedZone, RecordTarget} from 'aws-cdk-lib/aws-route53';
import {ApiGatewayv2DomainProperties} from 'aws-cdk-lib/aws-route53-targets';
import {
  CfnContactList,
  ConfigurationSet,
  EmailIdentity,
  Identity,
  SuppressionReasons,
} from 'aws-cdk-lib/aws-ses';
import * as settings from './settings.mjs';

/*
 * Identity.publicHostedZone verifies the zone's own name, seanmcn.com. This
 * verifies a subdomain instead, while still letting CDK write the DKIM and
 * MAIL FROM records into the seanmcn.com zone.
 */
class SubdomainIdentity extends Identity {
  constructor(hostedZone, domain) {
    super();
    this.hostedZone = hostedZone;
    this.value = domain;
  }
}

export class SubscriptionsStack extends Stack {
  /*
   * props.hostedZoneId skips looking the zone up in the account, so the stack
   * can be synthesised without AWS credentials (the tests do this).
   */
  constructor(scope, id, props = {}) {
    super(scope, id, props);

    const zone = props.hostedZoneId ?
      HostedZone.fromHostedZoneAttributes(this, 'Zone', {
        hostedZoneId: props.hostedZoneId,
        zoneName: settings.DOMAIN,
      }) :
      HostedZone.fromLookup(this, 'Zone', {domainName: settings.DOMAIN});

    // Addresses that bounce or complain are never sent to again.
    const configurationSet = new ConfigurationSet(this, 'ConfigurationSet', {
      configurationSetName: settings.CONFIGURATION_SET,
      suppressionReasons: SuppressionReasons.BOUNCES_AND_COMPLAINTS,
      reputationMetrics: true,
    });

    const identity = new EmailIdentity(this, 'Identity', {
      identity: new SubdomainIdentity(zone, settings.SENDING_DOMAIN),
      mailFromDomain: settings.MAIL_FROM_DOMAIN,
      configurationSet,
    });

    // The subscribers. Kept if the stack is deleted.
    const contactList = new CfnContactList(this, 'ContactList', {
      contactListName: settings.CONTACT_LIST,
      description: 'People who get an email when an item is published',
      topics: [{
        topicName: settings.TOPIC,
        displayName: 'New posts on seanmcn.com',
        description: 'An email whenever something new goes up on ' +
          'seanmcn.com.',
        defaultSubscriptionStatus: 'OPT_OUT',
      }],
    });
    contactList.applyRemovalPolicy(RemovalPolicy.RETAIN);

    const contactListArn = this.formatArn({
      service: 'ses',
      resource: 'contact-list',
      resourceName: settings.CONTACT_LIST,
    });
    const configurationSetArn = this.formatArn({
      service: 'ses',
      resource: 'configuration-set',
      resourceName: settings.CONFIGURATION_SET,
    });

    const signup = new Function(this, 'Signup', {
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      code: Code.fromAsset(fileURLToPath(new URL('../lambda', import.meta.url))),
      handler: 'index.handler',
      memorySize: 256,
      timeout: Duration.seconds(10),
      environment: {
        SITE_ORIGINS: settings.SITE_ORIGINS.join(','),
        FROM_NAME: settings.FROM_NAME,
        FROM_ADDRESS: settings.FROM_ADDRESS,
        REPLY_TO: settings.REPLY_TO,
        CONTACT_LIST: settings.CONTACT_LIST,
        TOPIC: settings.TOPIC,
        CONFIGURATION_SET: settings.CONFIGURATION_SET,
      },
      logGroup: new LogGroup(this, 'SignupLogs', {
        retention: RetentionDays.ONE_MONTH,
        removalPolicy: RemovalPolicy.DESTROY,
      }),
    });
    signup.node.addDependency(contactList);
    signup.addToRolePolicy(new PolicyStatement({
      actions: ['ses:GetContact', 'ses:CreateContact', 'ses:UpdateContact'],
      resources: [contactListArn],
    }));
    signup.addToRolePolicy(new PolicyStatement({
      actions: ['ses:SendEmail'],
      resources: [
        identity.emailIdentityArn,
        configurationSetArn,
        contactListArn,
      ],
    }));

    const certificate = new Certificate(this, 'ApiCertificate', {
      domainName: settings.API_DOMAIN,
      validation: CertificateValidation.fromDns(zone),
    });
    const apiDomain = new DomainName(this, 'ApiDomain', {
      domainName: settings.API_DOMAIN,
      certificate,
    });

    // Only reachable on subscribe.seanmcn.com, and throttled well past
    // anything the forms need.
    const api = new HttpApi(this, 'Api', {
      createDefaultStage: false,
      disableExecuteApiEndpoint: true,
    });
    api.addStage('Stage', {
      stageName: '$default',
      autoDeploy: true,
      domainMapping: {domainName: apiDomain},
      throttle: {rateLimit: 5, burstLimit: 10},
    });
    const integration = new HttpLambdaIntegration('SignupIntegration', signup);
    for (const path of ['/subscribe', '/confirm']) {
      api.addRoutes({path, methods: [HttpMethod.POST], integration});
    }

    new ARecord(this, 'ApiRecord', {
      zone,
      recordName: settings.API_DOMAIN,
      target: RecordTarget.fromAlias(new ApiGatewayv2DomainProperties(
          apiDomain.regionalDomainName,
          apiDomain.regionalHostedZoneId,
      )),
    });

    new CfnOutput(this, 'SignupUrl', {value: `https://${settings.API_DOMAIN}`});
  }
}
