'use server';

import api from '@/lib/api';
import { getErrorMessage } from '@/utils/error';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteAccount() {
  try {
    await api.delete('v1/u');
  } catch (error) {
    return getErrorMessage(error, 'Unable to delete account. Try again.');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
