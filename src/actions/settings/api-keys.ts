'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { auth } from '@/lib/auth';
import { verifySession } from '@/data/_verifySession';
import { createApiKeySchema } from '@/schema';

const toTokenExpiration = (expiresInDays: number) => {
  return 60 * 60 * 24 * expiresInDays;
};

export async function createApiKey(formData: FormData): ActionResponse<string> {
  await verifySession();

  const validation = createApiKeySchema.safeParse({
    name: formData.get('name'),
    expiration: formData.get('expiration'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const expiresInDays = Number(validation.data.expiration) || 0;

  try {
    const token = await auth.api.createApiKey({
      body: {
        name: validation.data.name,
        expiresIn: expiresInDays > 0 ? toTokenExpiration(expiresInDays) : null,
        prefix: 'uga_',
      },
      headers: await headers(),
    });
    revalidatePath(ROUTES.SETTINGS_APIKEYS);
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

  revalidatePath(ROUTES.SETTINGS_APIKEYS);
  return [null, null];
}
