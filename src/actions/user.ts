'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage } from '@/utils/error';
import { auth } from '@/lib/auth';
import { verifySession } from '@/data/_verifySession';
import { profileSchema } from '@/schema';

type ProfileFormValues = z.infer<typeof profileSchema>;

export async function updateProfile(data: ProfileFormValues): ActionResponse {
  await verifySession();

  try {
    await auth.api.changeEmail({
      headers: await headers(),
      body: {
        newEmail: data.email,
        callbackURL: ROUTES.SETTINGS,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to change email. Try again.');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.SETTINGS);
  return [null, null];
}
