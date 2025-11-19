import crypto from 'node:crypto';

export function safeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  // Avoid length leaks: compare length first in constant-time way
  if (aBuf.length !== bBuf.length) {
    // Compare against itself to keep timing consistent
    return crypto.timingSafeEqual(aBuf, aBuf) && false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}
