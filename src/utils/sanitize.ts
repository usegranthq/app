import DOMPurify from 'isomorphic-dompurify';

export default function sanitize(value: string) {
  return DOMPurify.sanitize(value);
}
