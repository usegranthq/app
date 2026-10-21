import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import DeleteAccount from './DeleteAccount';

export default function DangerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>Permanently remove your account and all your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Permanently remove your account and all of its contents from the useGrant. This action is not reversible, so
          please continue with caution.
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <DeleteAccount />
      </CardFooter>
    </Card>
  );
}
