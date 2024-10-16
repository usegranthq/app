import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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

        <p className="mt-6 text-sm text-muted-foreground">
          Note: If you had any subscriptions, we will only retain the necessary information, such as your email address
          and subscription details, to manage your subscription. Your card details will not be stored.
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <DeleteAccount />
      </CardFooter>
    </Card>
  );
}
