'use server';

import { redirect } from 'next/navigation';

import api from '@/lib/api';
import { getErrorMessage } from '@/utils/error';

export async function login(formData: FormData): Promise<ActionResponse> {
  const payload = {
    email: formData.get('email'),
  };

  try {
    await api.post('v1/login', { json: payload });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Unable to login with email. Try again.');
    return [errorMessage, null];
  }

  redirect('/verify');
}
