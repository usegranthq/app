import { cn } from '@/shadcn/lib/utils';

import Logo from './Logo';
import { frame, LINKS, mono } from './styles';

const COLUMNS = [
  {
    title: 'Packages',
    links: [
      { label: 'Javascript SDK', href: 'https://npmjs.com/package/@usegrant/sdk' },
      { label: 'MCP Server', href: 'https://npmjs.com/package/@usegrant/mcp' },
      { label: 'AI SDK Tools', href: 'https://npmjs.com/package/@usegrant/ai-sdk-tools' },
    ],
  },
  {
    title: 'Infrastructure',
    links: [{ label: 'Docs', href: LINKS.DOCS }],
  },
  {
    title: 'Open source',
    links: [
      { label: 'GitHub', href: LINKS.GITHUB },
      { label: 'Apache-2.0 License', href: LINKS.LICENSE },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className={cn(frame, 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-10 pt-14 pb-10')}>
        <div className="col-span-2 flex min-w-0 flex-col gap-4 max-sm:col-span-1">
          <Logo />
          <a
            href={`mailto:${LINKS.SUPPORT_EMAIL}`}
            className={cn(mono, 'text-[13px] text-[#a3a3a3] hover:text-(--accent)')}
          >
            {LINKS.SUPPORT_EMAIL}
          </a>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3 text-[15px]">
            <span className={cn(mono, 'mb-1 text-[11px] tracking-[.06em] text-[#6f6f6f] uppercase')}>
              {column.title}
            </span>
            {column.links.map((link) => (
              <a key={link.label} href={link.href} className="text-[#a3a3a3] hover:text-(--accent)">
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className={cn(frame, mono, 'border-t border-white/8 pt-5 pb-8 text-xs text-[#6f6f6f]')}>
        © {currentYear} useGrant. Released under the Apache-2.0 License.
      </div>
    </footer>
  );
}
