import { Prisma, PrismaClient } from '@prisma/client';

import { env } from '@/env';

let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  db = global.prisma;
}

const isDbError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

export { db as prisma, isDbError };
export default db;
