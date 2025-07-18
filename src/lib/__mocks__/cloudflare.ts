import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import cloudflare from '../cloudflare';

const mockCloudflare = mockDeep<typeof cloudflare>();

beforeEach(() => {
  mockReset(mockCloudflare);
});

vi.mock('../cloudflare');

export default mockCloudflare;
