import { CSSProperties } from 'react';

import Footer from './Footer';
import Header from './Header';

const accentStyle = { '--accent': '#c6f432' } as CSSProperties;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={accentStyle}
      className="min-h-screen bg-[#0a0a0a] font-(family-name:--font-instrument-sans) text-[#ededed] antialiased selection:bg-(--accent) selection:text-[#0a0a0a]"
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
}
