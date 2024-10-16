import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import api from '@/lib/api';
import { Token } from '@/types/app.types';

import CreateToken from './CreateToken';
import TokensList from './TokensList';
import NoTokens from './NoTokens';

export default async function ApiPage() {
  const tokens = await api.get<Token[]>('v1/u/settings/tokens').json();

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
      {tokens.length === 0 ? (
        <NoTokens />
      ) : (
        <div className="mt-10">
          <TokensList tokens={tokens} />
        </div>
      )}
    </div>
  );
}
