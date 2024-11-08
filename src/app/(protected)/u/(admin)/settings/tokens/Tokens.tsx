import NoTokens from './NoTokens';
import TokensList from './TokensList';
import { getTokens } from '@/dal/tokens';

export default async function Tokens() {
  const tokens = await getTokens();

  if (tokens.length === 0) {
    return <NoTokens />;
  }

  return <TokensList tokens={tokens} />;
}
