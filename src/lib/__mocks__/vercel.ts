import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import vercel from '../vercel';

const mockVercel = mockDeep<typeof vercel>();

beforeEach(() => {
  mockReset(mockVercel);
});

vi.mock('../vercel');

export default mockVercel;
