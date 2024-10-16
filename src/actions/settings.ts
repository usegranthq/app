'use server';

import { revalidatePath } from 'next/cache';

import api from '@/lib/api';
import { getErrorMessage } from '@/utils/error';

export async function createToken(formData: FormData) {
  const name = formData.get('name') as string;
  const expiration = Number(formData.get('expiration')) || 0;

  const payload = { name, expiry_days: expiration };

  try {
    await api.post('v1/u/settings/tokens', { json: payload });
  } catch (error) {
    return getErrorMessage(error, 'Failed to create token. Try again.');
  }

  revalidatePath('/u/settings/tokens');
}

export async function deleteToken(id: string) {
  try {
    await api.delete(`v1/u/settings/tokens/${id}`);
  } catch (error) {
    return getErrorMessage(error, 'Failed to delete token. Try again.');
  }

  revalidatePath('/u/settings/tokens');
}
