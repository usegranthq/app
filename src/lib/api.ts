import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError, ApiErrorData } from '@/utils/error';
import { isNotNullOrUndefined } from '@/utils/validators';
import { isObject } from '@/utils/object';
import * as constants from '@/constants';

const backendURL = process.env.BACKEND_URL;

function joinAbsoluteUrlPath(...args: string[]) {
  return '/' + args.map((pathPart) => pathPart.replace(/(^\/|\/$)/g, '')).join('/');
}

const getSetCookies = (response: Response): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map(parseSetCookie).filter(isNotNullOrUndefined);
};

const toRequestBody = <T>(body: T): BodyInit | null => {
  return isObject(body) ? JSON.stringify(body) : (body as BodyInit | null);
};

const toResponseData = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return response.text() as unknown as Promise<T>;
};

type BodyInitOrObject = BodyInit | null | Record<string, unknown>;
interface ApiOptions<B extends BodyInitOrObject> extends Omit<RequestInit, 'body'> {
  body?: B;
}

export async function api<T, B extends BodyInitOrObject>(apiPath: string, options: ApiOptions<B> = {}): Promise<T> {
  const url = new URL(joinAbsoluteUrlPath('/api', apiPath), backendURL);
  const cookieStore = cookies();
  const cookieString = cookieStore.toString();

  const response = await fetch(url, {
    ...options,
    body: toRequestBody(options.body),
    headers: {
      ...options.headers,
      Cookie: cookieString,
    },
  });

  if (!response.ok) {
    let errorBody: ApiErrorData | null = null;
    let errorDescription = `An error occurred while calling the backend API for path: ${apiPath}`;

    if (response.status === 401) {
      cookieStore.delete(constants.AUTH_COOKIE);
      cookieStore.delete(constants.VERIFY_COOKIE);
      redirect('/login');
    }

    try {
      errorBody = await response.json();
      errorDescription = errorBody?.error_description ?? errorDescription;
    } catch {
      // JSON parsing failed, use default error description
    }

    throw new ApiError(response.status, errorBody, errorDescription);
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

  return toResponseData<T>(response);
}

api.get = async function <T>(
  apiPath: string,
  params: Record<string, string> = {},
  options: Omit<ApiOptions<null>, 'body' | 'method'> = {},
): Promise<T> {
  return api<T, null>(apiPath + '?' + new URLSearchParams(params), { ...options, method: 'GET' });
};

api.post = async function <T, B extends BodyInitOrObject>(
  apiPath: string,
  body: B,
  options: Omit<ApiOptions<B>, 'body' | 'method'> = {},
): Promise<T> {
  return api<T, B>(apiPath, { ...options, method: 'POST', body });
};

export default api;
