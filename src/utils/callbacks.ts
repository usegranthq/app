import crypto from 'node:crypto';

const stateValidityDuration = 12 * 60 * 60; // 12 hour in seconds

export function generateHMACState(secret: string): string {
  const hmacSecretKey = Buffer.from(secret);
  // generate a random nonce (16 bytes)
  const nonce = crypto.randomBytes(16);
  // get the current timestamp as a string
  const timestamp = Math.floor(Date.now() / 1000).toString();
  // create the message to sign, combining the nonce and timestamp
  const message = `${nonce.toString('base64')}:${timestamp}`;
  // create an HMAC-SHA256 signature using the HMAC secret key and the message
  const h = crypto.createHmac('sha256', hmacSecretKey);
  h.update(message);
  // convert the signature to a hexadecimal string
  const signature = h.digest('hex');
  // combine the message and signature, and encode them in base64 for safe URL transmission
  return Buffer.from(`${message}:${signature}`).toString('base64');
}

export function verifyHMACState(secret: string, state?: string): boolean {
  if (!state || typeof state !== 'string') return false;
  const hmacSecretKey = Buffer.from(secret);
  let stateBytes: Buffer;
  try {
    stateBytes = Buffer.from(state, 'base64');
  } catch {
    return false;
  }
  const parts = stateBytes.toString().split(':');
  if (parts.length !== 3) {
    return false;
  }
  const [nonce, timestamp, receivedSignature] = parts;
  const message = `${nonce}:${timestamp}`;
  const timestampInt = parseInt(timestamp, 10);
  if (isNaN(timestampInt)) {
    return false;
  }
  if (Date.now() / 1000 - timestampInt > stateValidityDuration) {
    return false;
  }
  const h = crypto.createHmac('sha256', hmacSecretKey);
  h.update(message);
  const expectedSignature = h.digest('hex');
  // Use timingSafeEqual only if lengths match, otherwise return false
  try {
    const a = Buffer.from(receivedSignature, 'utf8');
    const b = Buffer.from(expectedSignature, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
