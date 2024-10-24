import fs from 'node:fs/promises';
import path from 'node:path';

import parse from '../parser';
import { formatDate } from 'date-fns';

const PRIVACY_PATH = path.join(process.cwd(), 'src/resources/privacy.md');

export default async function PrivacyPage() {
  const content = await parse(PRIVACY_PATH);
  const fileModified = await fs.stat(PRIVACY_PATH).then((stats) => stats.mtime);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mt-20">
        <h1 className="text-center text-5xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
          Last updated: {formatDate(fileModified, 'MMMM d, yyyy')}
        </p>
        <div className="my-20 tracking-wide">{content}</div>
      </div>
    </div>
  );
}
