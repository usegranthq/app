import { ColorPicker } from '@/components/ColorPicker';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import { TopUserNav } from './TopUserNav';

interface TopbarProps {
  children?: React.ReactNode;
}

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className="sticky top-0 flex h-14 items-center border-b bg-background px-4">
      <div className="flex-1">{children}</div>
      <div className="flex items-center space-x-2.5">
        <ColorPicker />
        <ThemeSwitcher />
        <TopUserNav />
      </div>
    </div>
  );
}
