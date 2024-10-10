//  can use as error instanceof ApiError
interface ApiErrorData {
  error: string;
  error_description: string;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(status: number, data: ApiErrorData, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const getErrorMessage = (error: unknown, defaultMessage: string) => {
  if (error instanceof ApiError) {
    return error.data.error_description || defaultMessage;
  }

  return defaultMessage;
};
