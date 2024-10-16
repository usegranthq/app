import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <p>Need help? We're here to assist you with any questions or issues you may have.</p>
      <p>
        Whether you have questions about our platform or need assistance with a specific issue, we're here to help! You
        can email us at{' '}
        <Link href="mailto:support@usegrant.dev" className="text-primary hover:underline">
          support@usegrant.dev
        </Link>{' '}
        with a detailed description of your issue.
      </p>

      <p>
        If you have feedback or a suggestion, please email us at{' '}
        <Link href="mailto:feedback@usegrant.dev" className="text-primary hover:underline">
          feedback@usegrant.dev
        </Link>
        .
      </p>
    </div>
  );
}
