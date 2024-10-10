import { ApiError } from '@/utils/error';
import { isNotNullOrUndefined } from '@/utils/validators';
import { parseSetCookie, ResponseCookie } from '@edge-runtime/cookies';
import { cookies } from 'next/headers';

const backendURL = process.env.BACKEND_URL;

const getSetCookies = (response: Response): ResponseCookie[] => {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies) {
    return [];
  }

  return setCookies.map((cookie) => parseSetCookie(cookie)).filter(isNotNullOrUndefined);
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = new URL(path, backendURL);
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json();
    const error = new ApiError(
      response.status,
      errorBody,
      errorBody.error_description || 'An error occured while while calling the backend API',
    );
    throw error;
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
