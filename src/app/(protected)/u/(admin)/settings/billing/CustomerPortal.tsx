'use client';

import { useTransition } from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';

import { redirectToCustomerPortal } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';

export default function CustomerPortal() {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();

  const handleButtonClick = async () => {
    startTransition(async () => {
      progress.start();
      const [errorMessage, url] = await redirectToCustomerPortal();
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      window.open(url as string, '_blank');
    });
  };

  return (
    <div className="mt-5 flex">
      <Button onClick={handleButtonClick} size="sm" variant="outline" disabled={isPending}>
        View customer portal <ExternalLinkIcon />
      </Button>
    </div>
  );
}
