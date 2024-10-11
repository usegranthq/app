import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { cookies } from 'next/headers';

import { ApiError, ApiErrorData } from '@/utils/error';
import { isNotNullOrUndefined } from '@/utils/validators';
import { isObject } from '@/utils/object';

const backendURL = process.env.BACKEND_URL;

const getSetCookies = (response: Response): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map((cookie) => parseSetCookie(cookie)).filter(isNotNullOrUndefined);
};

const toRequestBody = <T>(body: T): BodyInit | null => {
  if (isObject(body)) {
    return JSON.stringify(body);
  }

  return body as BodyInit | null;
};

type BodyInitOrObject = BodyInit | null | Record<string, unknown>;
interface ApiOptions<B extends BodyInitOrObject> extends Omit<RequestInit, 'body'> {
  body?: B;
}

export async function api<T, B extends BodyInitOrObject>(path: string, options: ApiOptions<B> = {}): Promise<T> {
  const url = new URL(path, backendURL);

  const cookieString = cookies().toString();

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
    let errorDescription: string = `An error occurred while calling the backend API for path: ${path}`;

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
    cookies().set(cookie.name, cookie.value, {
      path: cookie.path,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    });
  });

  return response.json() as Promise<T>;
}

export default api;
