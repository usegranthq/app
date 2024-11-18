import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

type MessageHandler = (errorCode: string) => string;

type ErrorCode = 'EXISTS' | 'UNKNOWN';

export const isDbError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

const getErrorCodes = (error: unknown): ErrorCode => {
  if (isDbError(error)) {
    switch (error.code) {
      case 'P2002':
        return 'EXISTS';
      default:
        return 'UNKNOWN';
    }
  }

  return 'UNKNOWN';
};

export const getApiErrorMessage = (error: unknown, defaultMessage: string | MessageHandler) => {
  return typeof defaultMessage === 'function' ? defaultMessage(getErrorCodes(error)) : defaultMessage;
};

export const getZodErrorMessage = (error: ZodError) => {
  return error.errors[0].message;
};
