import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';

import { isNotNullOrUndefined } from '@/utils/validators';

export const parseSetCookies = (response: Response): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};
