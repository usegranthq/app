import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import db from '../db';

const mockDb = mockDeep<typeof db>();

beforeEach(() => {
  mockReset(mockDb);
});

vi.mock('../db');

export default mockDb;
