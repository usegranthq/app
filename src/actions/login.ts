'use server';

import { redirect, RedirectType } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { SignJWT } from 'jose';
import { z } from 'zod';

import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { auth } from '@/lib/auth';
import constants from '@/constants';
import { nanoid } from 'nanoid';
import db from '@/lib/db';
import { getSetCookies } from '@/lib/api';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' }),
  cf_token: z.string({ required_error: 'Missing captcha verification token.' }),
});

// public endpoint
export async function login(formData: FormData): ActionResponse {
  const validation = loginSchema.safeParse({
    email: formData.get('email'),
    cf_token: formData.get('cf-turnstile-response'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const payload = validation.data;

  try {
    await auth.api.signInMagicLink({
      body: {
        email: payload.email,
        callbackURL: `/u`,
      },
      headers: await headers(),
    });

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .setSubject(payload.email)
      .sign(new TextEncoder().encode(process.env.JWT_SIGNING_SECRET));

    const cookieStore = await cookies();
    cookieStore.set(constants.VERIFY_COOKIE, token);
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to login with email. Try again.');
    return [errorMessage, null];
  }

  redirect('/verify');
}

const verifySchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' }),
  code: z.string({ required_error: 'Please enter the code sent to your email.' }),
});

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
    const resp = await auth.api.magicLinkVerify({
      query: { token: payload.code },
      headers: await headers(),
      asResponse: true,
    });

    // get cookies from response
    const cookiesList = getSetCookies(resp);
    if (cookiesList) {
      cookiesList.forEach((cookie) => {
        cookieStore.set(cookie.name, cookie.value, {
          path: cookie.path,
          maxAge: cookie.maxAge,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite,
        });
      });
    }

    const user = await db.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return ['Something went wrong. Please try again.', null];
    }

    const account = await db.account.findFirst({
      where: { userId: user.id },
    });

    if (!account) {
      const headersList = new Headers();
      const authCookie = cookieStore.get(constants.AUTH_COOKIE)?.value;

      if (authCookie) {
        headersList.set('cookie', `${constants.AUTH_COOKIE}=${authCookie}`);

        await auth.api.linkAccount({
          body: {
            email: payload.email,
            password: nanoid(16),
          },
          headers: headersList,
        });
      }
    }

    cookieStore.delete(constants.VERIFY_COOKIE);
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to verify code. Try again.');
    return [errorMessage, null];
  }

  redirect('/u', RedirectType.replace);
}
