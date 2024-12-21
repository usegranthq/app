import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import DeleteProviderAction from './DeleteProviderAction';

export default function DeleteProvider() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Provider</CardTitle>
        <CardDescription>Permanently remove your provider and all your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This will permanently delete your provider and all of its clients. This action is not reversible, so please
          continue with caution.
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <DeleteProviderAction />
      </CardFooter>
    </Card>
  );
}
