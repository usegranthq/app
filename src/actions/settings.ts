'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { addDays } from 'date-fns';
import { nanoid } from 'nanoid';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import ROUTES from '@/constants/routes';
import { verifySession } from '@/data/_verifySession';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { createTokenSchema } from '@/schema';

export async function createToken(formData: FormData): ActionResponse<string> {
  const session = await verifySession();

  const validation = createTokenSchema.safeParse({
    name: formData.get('name'),
    expiration: formData.get('expiration'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const expiresInDays = Number(validation.data.expiration) || 0;

  try {
    const token = await db.token.create({
      data: {
        token: 'usegrant_api_' + nanoid(),
        name: validation.data.name,
        expiresAt: expiresInDays > 0 ? addDays(new Date(), expiresInDays) : null,
        userId: session.user.id,
      },
    });
    revalidatePath(ROUTES.SETTINGS_TOKENS);
    return [null, token.token];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create token. Try again.');
    return [errorMessage, null];
  }
}

export async function deleteToken(id: string): ActionResponse {
  const session = await verifySession();

  try {
    await db.token.delete({ where: { id, userId: session.user.id } });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete token. Try again.');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.SETTINGS_TOKENS);
  return [null, null];
}

export async function deleteSessions(): ActionResponse {
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
  await verifySession();

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Unable to delete account. Try again.');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.ROOT, 'layout');
  redirect(ROUTES.ROOT);
}
