export function generateHash() {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}
