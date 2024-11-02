import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t px-4 py-8 lg:px-0">
      <div className="mx-auto flex max-w-7xl max-sm:flex-col">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm font-medium">© 2024 useGrant. All rights reserved.</p>
          <p className="font-mono text-sm font-medium text-muted-foreground">support@usegrant.com</p>
        </div>
        <div className="mt-14 flex gap-6 max-md:flex-col md:ml-auto md:mt-0 md:gap-12">
          <div>
            <p className="font-medium">Infrastructure</p>
            <div className="mt-3 flex flex-col gap-2 text-sm md:gap-4">
              <Link
                href="https://status.usegrant.dev"
                target="_blank"
                className="text-muted-foreground hover:underline"
              >
                Status
              </Link>
            </div>
          </div>
          <div>
            <p className="font-medium">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm md:gap-4">
              <Link href="/privacy" className="text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
