'use server';

import { redirect } from 'next/navigation';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/utils/error';

export async function login(formData: FormData): Promise<string | undefined> {
  const payload = {
    email: formData.get('email'),
  };

  try {
    await api('api/v1/login', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    return getErrorMessage(error, 'Unable to login with email. Try again.');
  }

  redirect('/verify');
}
