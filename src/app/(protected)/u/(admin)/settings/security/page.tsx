import { Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Sessions from './Sessions';
import SessionsLoading from './SessionsLoading';
import DeleteSessions from './DeleteSessions';

export default function ApiPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Security</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Monitor and manage your active sessions and other security settings.
      </p>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Delete all sessions</CardTitle>
            <CardDescription>
              Permanently remove all sessions. This will log you out of all the devices that are currently using this
              account, except the one you are currently on. This action cannot be undone, so please proceed with
              caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteSessions />
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Suspense fallback={<SessionsLoading />}>
          <Sessions />
        </Suspense>
      </div>
    </div>
  );
}
