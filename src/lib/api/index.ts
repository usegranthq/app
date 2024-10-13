import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';

import { isNotNullOrUndefined } from '@/utils/validators';
import * as constants from '@/constants';

const backendURL = process.env.BACKEND_URL;

const getSetCookies = (response: AxiosResponse): ResponseCookie[] => {
  const setCookies = response.headers['set-cookie'];
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};

const api = axios.create({
  baseURL: new URL('/api', backendURL).toString(),
});

api.interceptors.request.use((request) => {
  const cookieStore = cookies();
  request.headers['Cookie'] = cookieStore.toString();
  return request;
});

api.interceptors.response.use((response) => {
  const cookieStore = cookies();

  if (response.status === 401) {
    cookieStore.delete(constants.AUTH_COOKIE);
    cookieStore.delete(constants.VERIFY_COOKIE);
    redirect('/login');
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
});

export default api;
