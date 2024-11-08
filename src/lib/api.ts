import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ky, { KyResponse, Options as KyOptions } from 'ky';

import { isNotNullOrUndefined } from '@/utils/validators';
import * as constants from '@/constants';
import ROUTES from '@/constants/routes';

export type { KyOptions };

export const getSetCookies = (response: KyResponse): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};

const api = ky.create({
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies();
        request.headers.set('Cookie', cookieStore.toString());
        return request;
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        const cookieStore = await cookies();

        if (response.status === 401) {
          cookieStore.delete(constants.AUTH_COOKIE);
          cookieStore.delete(constants.VERIFY_COOKIE);
          if (process.env.NEXT_RUNTIME !== 'edge') {
            redirect(ROUTES.LOGIN);
          }
        }

        const setCookies = getSetCookies(response);
        setCookies.forEach((cookie) => {
          if (!cookie.value) {
            cookieStore.delete(cookie.name);
          } else {
            cookieStore.set(cookie.name, cookie.value, {
              path: cookie.path,
              maxAge: cookie.maxAge,
              httpOnly: cookie.httpOnly,
              secure: cookie.secure,
              sameSite: cookie.sameSite,
            });
          }
        });

        return response;
      },
    ],
  },
});

export default api;
