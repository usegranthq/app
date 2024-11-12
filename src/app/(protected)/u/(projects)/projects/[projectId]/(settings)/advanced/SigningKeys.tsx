import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSigningKeys } from '@/data/projects';

import RequestSigningKey from './RequestSigningKey';
import RemoveKey from './RemoveKey';

interface SigningKeysProps {
  projectId: string;
  domain: string;
}

export default async function SigningKeys({ projectId, domain }: SigningKeysProps) {
  const signingKeys = await getSigningKeys(projectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signing keys</CardTitle>
        <CardDescription>
          Manage your project signing keys. These are the keys that will be used to sign the JWT tokens. The latest one
          is used for signing the tokens. Old keys are still persisted in the database for compatibility with old
          tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          Your JWKS endpoint:{' '}
          <Link href={domain} target="_blank" className="text-sm underline underline-offset-2">
            {domain}
          </Link>
        </div>
        <p className="mb-2">The following keys are available:</p>
        <ol className="flex list-decimal flex-col gap-2.5 pl-5">
          {signingKeys.map((key, index) => {
            const isFirst = index === 0;

            return (
              <li key={key.kid} className="list-item">
                <div className="ml-2 flex items-center gap-3">
                  <span className="text-sm font-medium">{key.kid}</span>
                  {key.isDefault && <Badge variant="outline">Default</Badge>}
                  {isFirst && <Badge>Current</Badge>}
                  {!isFirst && !key.isDefault && <RemoveKey id={key.id} projectId={projectId} />}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            You can request a new key to rotate the signing keys. The newly generated key will be used for signing the
            tokens.
          </p>
          <RequestSigningKey projectId={projectId} />
        </div>
      </CardContent>
    </Card>
  );
}
