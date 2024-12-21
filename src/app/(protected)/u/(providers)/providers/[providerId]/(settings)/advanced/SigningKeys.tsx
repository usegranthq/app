import Link from 'next/link';

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Provider } from '@/types';

import KeysList from './KeysList';
import { getSigningKeys } from '@/data/providers';
import { FeatureUnavailable } from '@/blocks/FeatureUnavailable';

interface SigningKeysProps {
  provider: Provider;
  jwksUrl: string;
  canRotateSigningKey: boolean;
}

export default async function SigningKeys({ provider, jwksUrl, canRotateSigningKey }: SigningKeysProps) {
  const signingKeys = await getSigningKeys(provider.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signing keys</CardTitle>
        <CardDescription>
          Manage your provider signing keys. These are the keys that will be used to sign the JWT tokens. The latest one
          is used for signing the tokens. Old keys are still persisted in the database for compatibility with old
          tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          Your JWKS endpoint:{' '}
          <Link href={jwksUrl} target="_blank" className="text-sm underline underline-offset-2">
            {jwksUrl}
          </Link>
        </div>

        <FeatureUnavailable available={canRotateSigningKey} name="Auto rotate and request custom signing key" inline>
          <KeysList provider={provider} signingKeys={signingKeys} />
        </FeatureUnavailable>
      </CardContent>
    </Card>
  );
}
