import { TopUserNav } from './TopUserNav';
import { ThemeSwitcher } from './ThemeSwitcher';

interface TopbarProps {
  children?: React.ReactNode;
}

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <div>{children}</div>
      <div className="ml-auto flex items-center space-x-2.5">
        <ThemeSwitcher />
        <TopUserNav />
      </div>
    </div>
  );
}
