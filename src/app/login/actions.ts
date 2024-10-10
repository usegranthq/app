'use server';

import { api } from '@/lib/api';
import { ApiError } from '@/utils/error';
import { redirect } from 'next/navigation';

export async function loginWithEmail(formData: FormData): Promise<string | undefined> {
  const email = formData.get('email');

  try {
    await api('api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    const errMessage =
      error instanceof ApiError ? error.data.error_description : 'Unable to login with email. Try again.';
    return errMessage;
  }

  redirect('/verify');
}
