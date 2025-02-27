export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <p>Need help? We&apos;re here to assist you with any questions or issues you may have.</p>
      <p>
        Whether you have questions about our platform or need assistance with a specific issue, we&apos;re here to help!
        You can email us at{' '}
        <a href="mailto:support@usegrant.dev" className="text-primary hover:underline">
          support@usegrant.dev
        </a>{' '}
        with a detailed description of your issue.
      </p>

      <p>
        If you have feedback or a suggestion, please email us at{' '}
        <a href="mailto:feedback@usegrant.dev" className="text-primary hover:underline">
          feedback@usegrant.dev
        </a>
        .
      </p>
    </div>
  );
}
