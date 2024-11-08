import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { KyResponse, Options as KyOptions } from 'ky';

import { isNotNullOrUndefined } from '@/utils/validators';

export type { KyOptions };

export const getSetCookies = (response: KyResponse): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};
