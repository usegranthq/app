import Link from 'next/link';

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';

import KeysList from './KeysList';
import { getSigningKeys } from '@/data/projects';

interface SigningKeysProps {
  project: Project;
  domain: string;
}

export default async function SigningKeys({ project, domain }: SigningKeysProps) {
  const signingKeys = await getSigningKeys(project.id);

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

        <KeysList project={project} signingKeys={signingKeys} />
      </CardContent>
    </Card>
  );
}
