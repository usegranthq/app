import { Suspense } from 'react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import CreateToken from './CreateToken';
import Tokens from './Tokens';
import TokensLoading from './TokensLoading';

export default function ApiPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Tokens</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These tokens grant other applications full access to your account. Please exercise caution!
      </p>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a new token</CardTitle>
          </CardHeader>
          <CreateToken />
        </Card>
      </div>
      <div className="mt-10">
        <Suspense fallback={<TokensLoading />}>
          <Tokens />
        </Suspense>
      </div>
    </div>
  );
}
