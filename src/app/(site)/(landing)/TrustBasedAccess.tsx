import { codeToHtml } from 'shiki';

const code = `
import * as aws from '@aws-sdk/client-sts';

// get the token from usegrant.dev
const token = await usegrant.getToken({
  client_id: 'YOUR_CLIENT_ID',
  api_key: 'YOUR_API_KEY',
});

// use the token to assume a role
const command = new aws.AssumeRoleWithWebIdentityCommand({
  RoleArn: 'arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME',
  RoleSessionName: 'SessionName',
  WebIdentityToken: data.access_token,
});
const stsClient = new aws.STSClient();
await stsClient.send(command);
`;

export default async function TrustBasedAccess() {
  const out = await codeToHtml(code.trim(), {
    lang: 'ts',
    theme: 'plastic',
  });

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
            UseGrant leverages OAuth/OpenID standards, the most popular and secure protocols for authentication and
            authorization.
          </p>
        </div>
      </div>
      <div className="col-span-1 overflow-hidden rounded-xl border border-border text-sm shadow-md">
        <div dangerouslySetInnerHTML={{ __html: out }} className="[&>pre]:p-4" />
      </div>
    </div>
  );
}
