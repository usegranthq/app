'use server';

import { api, ApiError } from '@/lib/api';
import { redirect } from 'next/navigation';

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    await api('api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    redirect('/u');
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(error.status, error.data);
    }
    throw error;
  }
}
