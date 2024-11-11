import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { KyResponse, Options as KyOptions, HTTPError as KyError } from 'ky';

import { isNotNullOrUndefined } from '@/utils/validators';

export type { KyOptions };
export { KyError };

export const getSetCookies = (response: KyResponse): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};
