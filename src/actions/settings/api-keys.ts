'use server';

import { refresh } from 'next/cache';
import { headers } from 'next/headers';

import { verifySession } from '@/data/_verifySession';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { createApiKeySchema } from '@/schema';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';

const toTokenExpiration = (expiresInDays: number) => {
  return 60 * 60 * 24 * expiresInDays;
};

export async function createApiKey(formData: FormData): ActionResponse<string> {
  const { user } = await verifySession();

  const validation = createApiKeySchema.safeParse({
    name: formData.get('name'),
    expiration: formData.get('expiration'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const expiresInDays = Number(validation.data.expiration) || 0;

  // check if the api key name is already taken
  const existingApiKey = await db.apikey.findFirst({
    where: {
      name: {
        equals: validation.data.name,
        mode: 'insensitive',
      },
    },
  });
  if (existingApiKey) {
    return ['API key name already taken', null];
  }

  try {
    const token = await auth.api.createApiKey({
      body: {
        name: validation.data.name,
        expiresIn: expiresInDays > 0 ? toTokenExpiration(expiresInDays) : null,
        prefix: 'uga_',
        userId: user.id,
        permissions: {
          sdk: ['read', 'write'],
        },
      },
      headers: await headers(),
    });
    refresh();
    return [null, token.key];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create token. Try again.');
    return [errorMessage, null];
  }
}

export async function deleteApiKey(id: string): ActionResponse {
  await verifySession();

  try {
    await auth.api.deleteApiKey({
      body: {
        keyId: id,
      },
      headers: await headers(),
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete token. Try again.');
    return [errorMessage, null];
  }

  refresh();
  return [null, null];
}
