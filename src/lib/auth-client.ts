import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';

export const authClient = createAuthClient({
  plugins: [],
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
