import { useFormStatus } from 'react-dom';

import { Button } from '@/shadcn/components/ui/button';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      Continue
    </Button>
  );
}
