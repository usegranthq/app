'use client';

import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { Textarea } from '@/shadcn/components/ui/textarea';

import { updateProvider } from '@/actions';

import { useProviderContext } from '../../_blocks/ProviderContext';

const SaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Save
    </Button>
  );
};

export default function ProviderDetails() {
  const router = useRouter();
  const { provider } = useProviderContext();

  const handleSubmit = async (formData: FormData) => {
    const [error] = await updateProvider(provider.id, formData);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Provider details updated');
    router.refresh();
  };

  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Provider details</CardTitle>
          <CardDescription>Manage your provider settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label>Provider name</Label>
              <Input
                name="name"
                defaultValue={provider.name}
                required
                minLength={3}
                maxLength={32}
                placeholder="Provider name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Provider description</Label>
              <Textarea
                rows={3}
                name="description"
                defaultValue={provider.description}
                required
                minLength={3}
                maxLength={100}
                placeholder="Provider description"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <SaveButton />
        </CardFooter>
      </Card>
    </form>
  );
}
