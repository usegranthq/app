import { customSessionClient, inferAdditionalFields, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';

import { auth } from './auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), magicLinkClient(), customSessionClient<typeof auth>()],
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
