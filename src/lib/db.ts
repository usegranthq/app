import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const db = prisma;
export default db;
