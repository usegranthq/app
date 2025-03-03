'use server';

import { cookies, headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { SignJWT } from 'jose';
import ky from 'ky';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { auth } from '@/lib/auth';
import constants from '@/constants';
import { env } from '@/env';
import { loginSchema, verifySchema } from '@/schema';

interface TurnstileResponse {
  success: boolean;
  'error-codes': string[];
}

const TURNSTILE_SITE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// public endpoint
export async function login(formData: FormData): ActionResponse {
  const validation = loginSchema.safeParse({
    email: formData.get('email'),
    token: formData.get('cf-turnstile-response'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const headersList = await headers();

  const turnstileFormData = new FormData();
  turnstileFormData.append('secret', env.TURNSTILE_SECRET_KEY);
  turnstileFormData.append('response', validation.data.token);
  turnstileFormData.append('remoteip', headersList.get('x-forwarded-for') || '');

  const payload = validation.data;

  try {
    const resp = await ky
      .post<TurnstileResponse>(TURNSTILE_SITE_VERIFY_URL, {
        body: turnstileFormData,
      })
      .json();

    if (!resp.success) {
      return [resp['error-codes'].join(', ') || 'Unable to verify captcha. Try again.', null];
    }
  } catch {
    return ['Unable to verify captcha. Try again.', null];
  }

  try {
    await auth.api.signInMagicLink({
      body: {
        email: payload.email,
        callbackURL: ROUTES.DASHBOARD,
      },
      headers: headersList,
    });

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .setSubject(payload.email)
      .sign(new TextEncoder().encode(env.JWT_SIGNING_SECRET));

    const cookieStore = await cookies();
    cookieStore.set(constants.VERIFY_COOKIE, token);
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Unable to login with email. Try again.');
    return [errorMessage, null];
  }

  redirect(ROUTES.VERIFY);
}

// public endpoint
export async function verify(formData: FormData): ActionResponse {
  const validation = verifySchema.safeParse({
    code: formData.get('code'),
    email: formData.get('email'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const payload = validation.data;
  const cookieStore = await cookies();

  try {
    await auth.api.magicLinkVerify({
      query: { token: payload.code },
      headers: await headers(),
    });

    cookieStore.delete(constants.VERIFY_COOKIE);
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Unable to verify code. Try again.');
    return [errorMessage, null];
  }

  redirect(ROUTES.DASHBOARD, RedirectType.replace);
}
