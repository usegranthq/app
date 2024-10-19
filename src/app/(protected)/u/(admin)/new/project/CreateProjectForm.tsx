'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { createProject } from '@/actions';

function CreateProjectButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Create project</Button>;
}

export default function CreateProjectForm() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const [error, project] = await createProject(formData);

    if (error || !project) {
      toast.error(error);
      return;
    }

    toast.success(`Project ${project.name} created successfully`);
    router.push(`/u/projects/${project.id}`);
  };

  return (
    <form className="mt-10 flex w-full max-w-sm flex-col items-center gap-8" action={handleSubmit}>
      <div className="grid w-full gap-2">
        <Label>Name</Label>
        <Input name="name" placeholder="Project name" required minLength={3} maxLength={32} />
      </div>
      <div className="grid w-full gap-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          placeholder="Project description"
          required
          minLength={3}
          maxLength={100}
          rows={3}
        />
      </div>
      <div>
        <CreateProjectButton />
      </div>
    </form>
  );
}
