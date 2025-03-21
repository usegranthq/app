'use client';

import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';

import { createClient } from '@/actions';

function CreateClientButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Create client</Button>;
}

export default function CreateClientForm({ id }: { id: string }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const [error] = await createClient(id, formData);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(`Client created successfully`);
    router.push(`/u/providers/${id}`);
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
