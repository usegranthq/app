import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { getSigningKeys } from '@/data/providers';
import { getPlanDetails } from '@/data/user';
import { getDefaultDomain } from '@/app/provider-helpers';
import { Provider } from '@/types';

import KeysList from './KeysList';

interface SigningKeysProps {
  provider: Provider;
}

export default async function SigningKeys({ provider }: SigningKeysProps) {
  const jwksUrl = getDefaultDomain(provider.urlId, '/.well-known/jwks');
  const signingKeys = await getSigningKeys(provider.id);
  const plan = await getPlanDetails();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signing keys</CardTitle>
        <CardDescription>
          Manage your provider signing keys. These are the keys that will be used to sign the JWT tokens. The latest one
          is used for signing the tokens. Old keys are still persisted in the database unless deleted or rotated for
          compatibility with old tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          Your JWKS endpoint:{' '}
          <Link href={jwksUrl} target="_blank" className="text-sm underline underline-offset-2">
            {jwksUrl}
          </Link>
        </div>

        <KeysList provider={provider} signingKeys={signingKeys} plan={plan} />
      </CardContent>
    </Card>
  );
}
