import path from 'node:path';

import parse from '../parser';

const PRIVACY_PATH = path.join(process.cwd(), 'src/resources/privacy.md');

export default async function PrivacyPage() {
  const content = await parse(PRIVACY_PATH);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="pt-20">
        <h1 className="text-center text-5xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">Last updated: Jul 14, 2025</p>
        <div className="my-20 tracking-wide">{content}</div>
      </div>
    </div>
  );
}
