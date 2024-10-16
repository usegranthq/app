import Topbar from '../_blocks/Topbar';
import Header from './_blocks/Header';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Topbar>
        <Header />
      </Topbar>
      <div className="flex min-h-[calc(theme(height.dvh)-theme(spacing.12))] flex-col p-4 pt-10">{children}</div>
    </div>
  );
}
