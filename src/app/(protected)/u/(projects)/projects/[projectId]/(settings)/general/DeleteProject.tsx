import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import DeleteProjectAction from './DeleteProjectAction';

export default function DeleteProject() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Project</CardTitle>
        <CardDescription>Permanently remove your project and all your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This will permanently delete your project and all of its clients. This action is not reversible, so please
          continue with caution.
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <DeleteProjectAction />
      </CardFooter>
    </Card>
  );
}
