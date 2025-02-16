import Codeblock from '@/blocks/Codeblock';

const code = `
import { UseGrant } from '@usegranthq/sdk';
import * as aws from '@aws-sdk/client-sts';

const sdk = new UseGrant('YOUR_API_KEY');

// get the token from usegrant.dev
const resp = await sdk.createToken('providerId', 'clientId');

// use the token to assume a role
const command = new aws.AssumeRoleWithWebIdentityCommand({
  RoleArn: 'arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME',
  RoleSessionName: 'SessionName',
  WebIdentityToken: resp.accessToken,
});

const stsClient = new aws.STSClient();
await stsClient.send(command);
`;

export default function TrustBasedAccess() {
  return (
    <div className="mx-auto mt-28 grid max-w-6xl grid-cols-1 gap-10 md:mt-44 lg:grid-cols-2">
      <div className="col-span-1 flex flex-col items-center justify-center">
        <div className="max-sm:text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Trust-based Access</h2>
          <p className="mt-8 text-muted-foreground">
            Set up UseGrant as a trusted identity provider on your preferred platform. Generate tokens from your
            identity provider and use them to access your API effortlessly.
          </p>
          <p className="mt-6 text-muted-foreground">
            UseGrant leverages OAuth standards, the most popular and secure protocols for authentication and
            authorization.
          </p>
        </div>
      </div>
      <div className="col-span-1">
        <Codeblock code={code} />
      </div>
    </div>
  );
}
