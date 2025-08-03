import { STATUS_CODES } from '@/utils/rest';

export const toSdkJsonResponse = (data: unknown, status: number = STATUS_CODES.OK) => {
  const body = data ? JSON.stringify(data) : null;

  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
