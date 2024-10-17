import { TopUserNav } from './TopUserNav';
import { ThemeSwitcher } from './ThemeSwitcher';

interface TopbarProps {
  children?: React.ReactNode;
}

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <div className="flex-1">{children}</div>
      <div className="flex items-center space-x-2.5">
        <ThemeSwitcher />
        <TopUserNav />
      </div>
    </div>
  );
}
