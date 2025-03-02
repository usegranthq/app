import { Suspense } from 'react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import ApiKeys from './ApiKeys';
import ApiKeysLoading from './ApiKeysLoading';
import CreateApiKey from './CreateApiKey';

export default function ApiPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Api Keys</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These api keys grant other applications full access to your account. Please exercise caution!
      </p>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a new api key</CardTitle>
          </CardHeader>
          <CreateApiKey />
        </Card>
      </div>
      <div className="mt-10">
        <Suspense fallback={<ApiKeysLoading />}>
          <ApiKeys />
        </Suspense>
      </div>
    </div>
  );
}
