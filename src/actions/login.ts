'use server';

import { redirect } from 'next/navigation';

import api from '@/lib/api';
import { getApiErrorMessage } from '@/utils/error';

export async function login(formData: FormData): Promise<ActionResponse> {
  const payload = {
    email: formData.get('email'),
    cf_token: formData.get('cf-turnstile-response'),
  };

  if (!payload.cf_token) {
    return ['Missing captcha verification.', null];
  }

  try {
    await api.post('v1/login', { json: payload });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to login with email. Try again.');
    return [errorMessage, null];
  }

  redirect('/verify');
}
