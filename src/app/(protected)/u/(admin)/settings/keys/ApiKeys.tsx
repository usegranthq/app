import { getApiKeys } from '@/data/api-keys';

import ApiKeysList from './ApiKeysList';
import NoApiKeys from './NoApiKeys';

export default async function ApiKeys() {
  const apiKeys = await getApiKeys();

  if (apiKeys.length === 0) {
    return <NoApiKeys />;
  }

  return <ApiKeysList apiKeys={apiKeys} />;
}
