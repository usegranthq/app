import { codeToHtml } from 'shiki';

const code = `
import * as aws from '@aws-sdk/client-sts';

// get the token from usegrant.dev
const response = await fetch('//project.usegrant.dev/sdk/v1/token', {
  method: 'POST',
  body: JSON.stringify({
    access_token: 'YOUR_ACCESS_TOKEN',
    client_id: 'YOUR_CLIENT_ID',
  }),
});
const data = await response.json();

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
    <div className="mx-auto mt-44 grid max-w-6xl grid-cols-12 gap-10">
      <div className="col-span-7 overflow-hidden rounded-xl border border-border text-sm shadow-md">
        <div dangerouslySetInnerHTML={{ __html: out }} className="[&>pre]:p-4" />
      </div>
      <div className="col-span-5 flex flex-col items-center justify-center">
        <div>
          <h2 className="text-4xl font-bold">Trust-based Access</h2>
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
    </div>
  );
}
