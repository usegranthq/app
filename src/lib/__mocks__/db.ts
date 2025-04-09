import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import { PrismaClient } from '@root/prisma/client';

const mockDb = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockDb);
});

vi.mock('../db');

export default mockDb;
