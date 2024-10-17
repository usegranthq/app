'use server';

import { revalidatePath } from 'next/cache';

import api from '@/lib/api';
import { getErrorMessage } from '@/utils/error';
import { TokenWithToken } from '@/types/app.types';

export async function createToken(formData: FormData): ActionResponse<string> {
  const name = formData.get('name') as string;
  const expiration = Number(formData.get('expiration')) || 0;

  const payload = { name, expiry_days: expiration };

  try {
    const response = await api.post<TokenWithToken>('v1/u/settings/tokens', { json: payload }).json();
    revalidatePath('/u/settings/tokens');
    return [null, response.token];
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create token. Try again.');
    return [errorMessage, null];
  }
}

export async function deleteToken(id: string): ActionResponse<null> {
  try {
    await api.delete(`v1/u/settings/tokens/${id}`);
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete token. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/tokens');
  return [null, null];
}

export async function deleteSessions(): Promise<ActionResponse> {
  try {
    await api.delete('v1/u/settings/sessions');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete sessions. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/security');
  return [null, null];
}

export async function deleteSession(id: string): Promise<ActionResponse> {
  try {
    await api.delete(`v1/u/settings/sessions/${id}`);
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete session. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/u/settings/security');
  return [null, null];
}
