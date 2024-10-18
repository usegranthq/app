'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import api from '@/lib/api';
import { Project } from '@/types/app.types';
import { getApiErrorMessage } from '@/utils/error';

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
    const errorMessage = await getApiErrorMessage(error, 'Failed to create project');
    return [errorMessage, null];
  }
}

export async function updateProject(projectId: string, formData: FormData): Promise<ActionResponse> {
  const name = formData.get('name');
  const description = formData.get('description');

  const payload = {
    name,
    description,
  };

  try {
    await api.put(`v1/u/projects/${projectId}`, { json: payload });
    revalidatePath('/u/projects', 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to update project');
    return [errorMessage, null];
  }
}

export async function deleteProject(projectId: string): Promise<ActionResponse> {
  try {
    await api.delete(`v1/u/projects/${projectId}`);
    revalidatePath('/u/projects', 'layout');
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete project');
    return [errorMessage, null];
  }

  redirect('/u/projects');
}
