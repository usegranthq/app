import { execSync } from 'node:child_process';

export function getGitFileModifiedTime(path: string) {
  const lastCommitTime = execSync(`git log -1 --format="%ad" -- "${path}"`).toString().trim();
  return new Date(lastCommitTime);
}
