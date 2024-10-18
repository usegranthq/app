'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { updateProject } from '@/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useProjectContext } from '../../_blocks/ProjectContext';

const SaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Save
    </Button>
  );
};

export default function ProjectDetails() {
  const router = useRouter();
  const { project } = useProjectContext();

  const handleSubmit = async (formData: FormData) => {
    const [error] = await updateProject(project.id, formData);
    if (error) {
      toast.error(error);
    }
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
                defaultValue={project.name}
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
                defaultValue={project.description}
                required
                minLength={3}
                maxLength={100}
                placeholder="Project description"
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
