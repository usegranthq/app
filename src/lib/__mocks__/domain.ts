import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import customDomain from '../domain';

const mockCustomDomain = mockDeep<typeof customDomain>();

beforeEach(() => {
  mockReset(mockCustomDomain);
});

vi.mock('../domain');

export default mockCustomDomain;
