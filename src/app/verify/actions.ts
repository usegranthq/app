'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/utils/error';

export async function verify(formData: FormData): Promise<string | undefined> {
  const payload = {
    code: formData.get('code'),
  };

  try {
    await api.post('/v1/verify', payload);
    cookies().delete('verify');
  } catch (error) {
    return getErrorMessage(error, 'Unable to verify code. Try again.');
  }

  redirect('/u', RedirectType.replace);
}
