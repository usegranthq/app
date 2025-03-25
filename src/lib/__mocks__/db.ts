import { PrismaClient } from '@prisma/client';
import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

const mockDb = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockDb);
});

vi.mock('../db');

export default mockDb;
