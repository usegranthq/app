import path from 'node:path';

import parse from './parser';

const TERMS_PATH = path.join(process.cwd(), 'src', 'app', '(legal)', 'terms', 'terms.md');

export default async function TermsPage() {
  const content = await parse(TERMS_PATH);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mt-20">
        <h1 className="text-center text-5xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">Last updated: 23 October 2024</p>
        <div className="my-20 tracking-wide">{content}</div>
      </div>
    </div>
  );
}
