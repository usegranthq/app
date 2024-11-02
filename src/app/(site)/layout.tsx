import Footer from '@/blocks/Footer';
import Navbar from '@/blocks/Navbar';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      <div className="px-4">{children}</div>
      <Footer />
    </section>
  );
}
