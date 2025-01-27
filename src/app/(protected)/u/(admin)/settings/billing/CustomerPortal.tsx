'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { redirectToCustomerPortal } from '@/actions';
import { Button } from '@/components/ui/button';

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
    <div className="mt-10 flex">
      <Button onClick={handleButtonClick}>
        View Customer Portal <ExternalLinkIcon />
      </Button>
    </div>
  );
}
