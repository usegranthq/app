'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

import api from '@/lib/api';
import { getApiErrorMessage } from '@/utils/error';

export async function verify(formData: FormData): Promise<ActionResponse> {
  const payload = {
    code: formData.get('code'),
  };

  try {
    await api.post('v1/verify', { json: payload });
    cookies().delete('verify');
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to verify code. Try again.');
    return [errorMessage, null];
  }

  redirect('/u', RedirectType.replace);
}
