import { useFormStatus } from 'react-dom';

import { Button } from '@/shadcn/components/ui/button';

interface SubmitButtonProps {
  text: string;
}

export default function SubmitButton(props: SubmitButtonProps) {
  const { text = 'Sign in' } = props;
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {text}
    </Button>
  );
}
