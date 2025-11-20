import { PrismaPg } from '@prisma/adapter-pg';

import env from '@/env';
import { PrismaClient } from '@/prisma/client';

let db: PrismaClient;

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  db = global.prisma;
}

export default db;
