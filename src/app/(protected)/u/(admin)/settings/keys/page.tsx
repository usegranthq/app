import { Suspense } from 'react';

import ApiKeys from './ApiKeys';
import ApiKeysLoading from './ApiKeysLoading';
import CreateApiKey from './CreateApiKey';

export default function ApiPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">API Keys</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These api keys grant other applications full access to your account. Please exercise caution!
      </p>
      <div className="mt-6">
        <CreateApiKey />
      </div>
      <div className="mt-10">
        <Suspense fallback={<ApiKeysLoading />}>
          <ApiKeys />
        </Suspense>
      </div>
    </div>
  );
}
