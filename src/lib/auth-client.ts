import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';
import { magicLinkClient, anonymousClient, inferAdditionalFields } from 'better-auth/client/plugins';

import { auth } from './auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), magicLinkClient(), anonymousClient()],
  fetchOptions: {
    onError(e) {
      switch (e.error.status) {
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 401:
          toast.error('Unauthorized. Please login again.');
          break;
      }
    },
  },
});
