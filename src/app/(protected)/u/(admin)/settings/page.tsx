import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { getUser } from '@/data/user';

export default async function Settings() {
  const user = await getUser();

  return (
    <div className="grid gap-6">
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription className="mt-2">
              <p>
                This is the email address associated with your useGrant account. It is used for authentication over web
                and sending account-related notifications.
              </p>
              <p className="mt-4">
                Note: Currently changing the email is not supported as a self-service operation. Please contact support
                if you need to change your email.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border p-2 text-sm text-muted-foreground">{user.email}</div>
          </CardContent>
          <CardFooter>
            <Button disabled>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
