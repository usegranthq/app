import { STATUS_CODES } from '@/utils/rest';

export const toJsonResponse = (data: unknown, status: number = STATUS_CODES.OK) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
