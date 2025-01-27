import Topbar from '../_blocks/Topbar';
import Header from './_blocks/Header';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Topbar>
        <Header />
      </Topbar>
      <div className="flex min-h-[calc(theme(height.dvh)-theme(spacing.14))] p-4 pt-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col">{children}</div>
      </div>
    </div>
  );
}
