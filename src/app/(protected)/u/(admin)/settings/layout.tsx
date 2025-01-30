import SettingsNav from './SettingsNav';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <SettingsNav />
        {children}
      </div>
    </div>
  );
}
