'use server';

import api from '@/lib/api';

export async function logout() {
  await api.post('/v1/u/logout');
}
