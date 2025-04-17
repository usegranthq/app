import Link from 'next/link';

export default function Terms() {
  return (
    <p className="leading-relaxed font-mono text-center text-xs">
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
