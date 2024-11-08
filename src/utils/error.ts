import { HTTPError } from 'ky';
import { ZodError } from 'zod';

export const getApiErrorMessage = async (error: unknown, defaultMessage: string) => {
  if (!(error instanceof HTTPError)) {
    return defaultMessage;
  }

  if (error.response.status === 401) {
    return 'Unauthorized';
  }

  if (error.response.status === 404) {
    return 'Resource not found';
  }

  try {
    const responseBody = await error.response.json();

    if (responseBody && 'error_description' in responseBody) {
      return responseBody.error_description ?? defaultMessage;
    }
  } catch {
    return 'Something went wrong';
  }

  return defaultMessage;
};

export const getZodErrorMessage = (error: ZodError) => {
  return error.errors[0].message;
};
