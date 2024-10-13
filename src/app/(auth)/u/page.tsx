import { request } from '@/lib/api';

export default async function UserPage() {
  await request('/v1/users/me');

  return <div>User page</div>;
}
