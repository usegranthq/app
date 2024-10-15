import { LoaderIcon } from 'lucide-react';

const loadingText = [
  'Synchronizing awesomeness...',
  'Bringing your world to life...',
  "Just a sec, we're setting things up...",
  'Polishing pixels...',
  'Gearing up for greatness...',
  'Unlocking your experience...',
  'Hang tight, magic is happening...',
  'Firing up the engines...',
  'Making things awesome for you...',
  'Final touches in progress...',
  'Your adventure is about to begin...',
  "Hold on, we're almost there...",
  'The fun is just a moment away...',
  'Getting things ready just for you...',
  'Preparing your personalized experience...',
];

export default function UserLoading() {
  const randomText = loadingText[Math.floor(Math.random() * loadingText.length)];

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoaderIcon className="size-6 animate-spin" />
        <h1 className="font-mono font-bold tracking-wider">{randomText}</h1>
      </div>
    </div>
  );
}
