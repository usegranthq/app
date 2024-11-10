'use server';

import { addDays } from 'date-fns';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getApiErrorMessage } from '@/utils/error';
import { verifySession } from '@/data/_verifySession';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

const createTokenSchema = z.object({
  name: z.string(),
  expiration: z.number().optional(),
});

export async function createToken(formData: FormData): ActionResponse<string> {
  const session = await verifySession();

  const validation = createTokenSchema.safeParse({
    name: formData.get('name'),
    expiration: formData.get('expiration'),
  });

  if (!validation.success) {
    return ['Invalid form data. Try again.', null];
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
    revalidatePath('/u/settings/tokens');
    return [null, token.token];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to create token. Try again.');
    return [errorMessage, null];
  }
}

export async function deleteToken(id: string): ActionResponse {
  const session = await verifySession();

  try {
    await db.token.delete({ where: { id, userId: session.user.id } });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete token. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/tokens');
  return [null, null];
}

export async function deleteSessions(): ActionResponse {
  await verifySession();

  try {
    await auth.api.revokeOtherSessions({
      headers: await headers(),
    });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete sessions. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/security');
  return [null, null];
}

export async function deleteSession(id: string): ActionResponse {
  await verifySession();

  try {
    await auth.api.revokeSession({
      body: {
        id,
      },
      headers: await headers(),
    });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete session. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/security');
  return [null, null];
}

export async function deleteAccount(): ActionResponse {
  const session = await verifySession();

  try {
    await db.user.delete({
      where: {
        id: session.user.id,
      },
    });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to delete account. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
