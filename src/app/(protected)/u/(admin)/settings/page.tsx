import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { User } from '@/types/app.types';

export default async function Settings() {
  const user = await api.get('v1/u/me').json<User>();

  return (
    <div className="grid gap-6">
      <Card>
        <form>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription className="mt-2">
              Enter the email addresses you want to use to log in with useGrant. Your primary email will be used for
              account-related notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border p-2 text-sm text-muted-foreground">{user.email}</div>
          </CardContent>
          <CardFooter>
            <Button disabled>Save</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
