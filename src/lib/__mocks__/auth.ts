import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import { auth } from '../auth';

const mockAuth = mockDeep<typeof auth>();

beforeEach(() => {
  mockReset(mockAuth);
});

vi.mock('../auth', () => {
  return {
    auth: mockAuth,
  };
});

export default mockAuth;
