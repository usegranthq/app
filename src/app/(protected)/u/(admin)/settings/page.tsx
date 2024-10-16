import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
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
            <div className="rounded-md border border-border p-2 text-sm text-muted-foreground">
              example@usegrant.dev
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
