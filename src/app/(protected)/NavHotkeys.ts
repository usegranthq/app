'use client';

import { useRouter } from 'next/navigation';
import { Options, useHotkeys } from 'react-hotkeys-hook';

const hotkeyOptions: Options = {
  enableOnFormTags: true,
};

export default function Hotkeys() {
  const router = useRouter();

  useHotkeys('shift+meta+A', () => router.push('/u/settings'), hotkeyOptions);
  useHotkeys('shift+meta+S', () => router.push('/u/settings/security'), hotkeyOptions);

  return null;
}
