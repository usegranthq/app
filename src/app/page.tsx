import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center gap-8 mx-auto">
      <div>
        <h1 className="text-5xl font-bold text-center">Simplify Machine-to-Machine Authentication</h1>
        <p className="text-center max-w-xl text-lg font-medium mt-2.5 mx-auto">
          Set up secure M2M authentication in minutes. Built on OAuth/OpenID standards for maximum security.
        </p>
      </div>

      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Button asChild>
          <Link href="/login">Get started</Link>
        </Button>
        <Button variant="secondary">Read the guides</Button>
      </div>
    </div>
  );
}
