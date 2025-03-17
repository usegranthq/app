'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';

import { redirectToCustomerPortal } from '@/actions';

export default function CustomerPortal() {
  const handleButtonClick = async () => {
    const [errorMessage, url] = await redirectToCustomerPortal();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    window.open(url as string, '_blank');
  };

  return (
    <div className="mt-5 flex">
      <Button onClick={handleButtonClick} size="sm" variant="outline">
        View customer portal <ExternalLinkIcon />
      </Button>
    </div>
  );
}
