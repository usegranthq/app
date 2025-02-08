import { getTokens } from '@/data/tokens';

import NoTokens from './NoTokens';
import TokensList from './TokensList';

export default async function Tokens() {
  const tokens = await getTokens();

  if (tokens.length === 0) {
    return <NoTokens />;
  }

  return <TokensList tokens={tokens} />;
}
