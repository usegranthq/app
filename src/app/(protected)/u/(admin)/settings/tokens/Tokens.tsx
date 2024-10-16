import api from '@/lib/api';
import { Token } from '@/types/app.types';

import NoTokens from './NoTokens';
import TokensList from './TokensList';

export default async function Tokens() {
  const tokens = await api.get<Token[]>('v1/u/settings/tokens').json();

  if (tokens.length === 0) {
    return <NoTokens />;
  }

  return <TokensList tokens={tokens} />;
}
