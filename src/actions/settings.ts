'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage } from '@/utils/error';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import vercel from '@/lib/vercel';
import { verifySession } from '@/data/_verifySession';

export async function deleteOtherSessions(): ActionResponse {
  await verifySession();

  try {
    await auth.api.revokeOtherSessions({
      headers: await headers(),
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete sessions. Try again.');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.SETTINGS_SECURITY);
  return [null, null];
}

export async function deleteSession(token: string): ActionResponse {
  await verifySession();

  try {
    await auth.api.revokeSession({
      body: {
        token,
      },
      headers: await headers(),
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete session. Try again.');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.SETTINGS_SECURITY);
  return [null, null];
}

export async function deleteAccount(): ActionResponse {
  const { user } = await verifySession();

  // get all domains for the user
  const domains = await db.domain.findMany({
    where: {
      Provider: {
        userId: user.id,
      },
    },
  });

  for (const domain of domains) {
    try {
      await vercel.domains.delete(domain.domain);
    } catch {
      return ['Failed to detach domain associated with your account. Try again or contact support.', null];
    }
  }

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });
  } catch (error) {
    const defaultErrorMessage =
      'Unable to delete account. Try with a fresh session by logging out and in again or contact support.';
    const errorMessage = getApiErrorMessage(error, defaultErrorMessage);
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.ROOT, 'layout');
  redirect(ROUTES.ROOT);
}
