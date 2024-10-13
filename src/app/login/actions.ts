'use server';

import { redirect } from 'next/navigation';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/utils/error';

export async function login(formData: FormData): Promise<string | undefined> {
  const payload = {
    email: formData.get('email'),
  };

  try {
    await api.post('/v1/login', payload);
  } catch (error) {
    return getErrorMessage(error, 'Unable to login with email. Try again.');
  }

  redirect('/verify');
}
