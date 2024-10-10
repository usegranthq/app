'use server';

import { api } from '@/lib/api';
import { ApiError } from '@/utils/error';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export async function verify(formData: FormData): Promise<string | undefined> {
  const code = formData.get('code');

  try {
    await api('api/v1/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        Cookie: cookies().toString(),
      },
    });

    cookies().delete('verify');
  } catch (error) {
    const errMessage = error instanceof ApiError ? error.data.error_description : 'Unable to verify code. Try again.';
    return errMessage;
  } finally {
    redirect('/u', RedirectType.replace);
  }
}
