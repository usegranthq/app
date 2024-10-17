'use server';

import { revalidatePath } from 'next/cache';

import api from '@/lib/api';
import { Project } from '@/types/app.types';
import { getErrorMessage } from '@/utils/error';

export async function createProject<T = Project>(formData: FormData): Promise<ActionResponse<T>> {
  const name = formData.get('name');
  const description = formData.get('description');

  const payload = {
    name,
    description,
  };

  try {
    const project = await api.post<T>('v1/u/projects', { json: payload }).json();
    revalidatePath('/u/projects', 'layout');
    return [null, project];
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create project');
    return [errorMessage, null];
  }
}
