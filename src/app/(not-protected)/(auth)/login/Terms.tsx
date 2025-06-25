import Link from 'next/link';

export default function Terms() {
  return (
    <p className="text-center font-mono text-xs leading-relaxed">
      By continuing, you agree to our{' '}
      <Link href="/terms" className="underline underline-offset-4">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline underline-offset-4">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
