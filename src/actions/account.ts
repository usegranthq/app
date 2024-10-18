'use server';

import api from '@/lib/api';
import { getApiErrorMessage } from '@/utils/error';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteAccount(): Promise<ActionResponse> {
  try {
    await api.delete('v1/u');
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Unable to delete account. Try again.');
    return [errorMessage, null];
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
