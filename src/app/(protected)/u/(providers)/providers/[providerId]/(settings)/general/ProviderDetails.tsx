'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { updateProvider } from '@/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    toast.success('Project details updated');
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project details</CardTitle>
        <CardDescription>Manage your project settings.</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label>Project name</Label>
              <Input
                name="name"
                defaultValue={provider.name}
                required
                minLength={3}
                maxLength={32}
                placeholder="Project name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Project description</Label>
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
      </form>
    </Card>
  );
}
