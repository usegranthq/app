'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function RedirectErrorRenderer() {
  const searchParams = useSearchParams();
  const error = searchParams.get('redirect_error');
  const messageRendered = useRef(false);

  useEffect(() => {
    if (!error || messageRendered.current) {
      return;
    }

    messageRendered.current = true;
    toast.error(error);
    window.history.replaceState({}, '', window.location.pathname);
  }, [error]);

  return null;
}
