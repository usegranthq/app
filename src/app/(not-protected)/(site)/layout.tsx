import { cn } from '@/shadcn/lib/utils';

import Footer from './Footer';
import Navbar from './Navbar';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative">
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-50',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(#e8e8e8_1px,transparent_1px)]',
          'dark:[background-image:radial-gradient(#202020_1px,transparent_1px)]',
        )}
      />
      <Navbar />
      <div className="px-4">{children}</div>
      <Footer />
    </section>
  );
}
