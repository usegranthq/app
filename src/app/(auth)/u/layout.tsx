import { UserNav } from './_components/UserNav';
import SWR from './_components/SWR';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWR>
      <section className="">
        <div className="border-b">
          <div className="flex h-14 items-center px-4">
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </section>
    </SWR>
  );
}
