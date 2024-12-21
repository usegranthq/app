'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createClient } from '@/actions';

function CreateClientButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Create client</Button>;
}

export default function CreateClientForm({ providerId }: { providerId: string }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const [error] = await createClient(providerId, formData);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(`Client created successfully`);
    router.push(`/u/providers/${providerId}`);
  };

  return (
    <form className="mt-10 flex w-full max-w-sm flex-col items-center gap-8" action={handleSubmit}>
      <div className="grid w-full gap-2">
        <Label>Name</Label>
        <Input name="name" placeholder="Client name" required minLength={3} maxLength={32} />
      </div>
      <div className="grid w-full gap-2">
        <Label>Audience</Label>
        <Input name="audience" placeholder="sts.amazonaws.com" required minLength={3} />
      </div>
      <div>
        <CreateClientButton />
      </div>
    </form>
  );
}
