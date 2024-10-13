import { minimumDelay } from '@/utils/time';

const minimumLoadingTime = 1000;

export default async function UserPage() {
  const initialTime = Date.now();
  await fetch(`http://localhost:7500/api/me`);
  const currentTime = Date.now();
  await minimumDelay(minimumLoadingTime, initialTime, currentTime);

  return <div>User page</div>;
}
