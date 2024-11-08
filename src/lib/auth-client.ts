import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';
import { magicLinkClient, anonymousClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), anonymousClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
    },
  },
});
