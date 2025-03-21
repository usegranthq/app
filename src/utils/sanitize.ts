import DOMPurify from 'isomorphic-dompurify';

export default function sanitize(value: string) {
  return DOMPurify.sanitize(value);
}

export function tryDecode(str: string) {
  try {
    return str.includes('%') ? decodeURIComponent(str) : str;
  } catch {
    return str;
  }
}
