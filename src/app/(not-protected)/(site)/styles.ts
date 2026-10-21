// shared class names for the marketing site, which uses its own dark palette
export const LINKS = {
  DOCS: 'https://www.usegrant.dev/docs',
  GITHUB: 'https://github.com/usegranthq',
  LICENSE: 'https://github.com/usegranthq/app/blob/master/LICENSE',
  SUPPORT_EMAIL: 'support@usegrant.dev',
};

export const SDK_PACKAGE = '@usegrant/sdk';

export const mono = 'font-(family-name:--font-fragment-mono)';
export const frame = 'mx-auto max-w-[1240px] border-x border-white/8 px-[clamp(20px,4vw,48px)]';
export const eyebrow = `${mono} text-xs tracking-[.06em] text-[#8a8a8a] uppercase`;
export const sectionTitle =
  'm-0 text-[clamp(36px,4.2vw,56px)] leading-none font-semibold tracking-[-0.035em] text-balance';
export const body = 'm-0 text-lg leading-[1.6] text-pretty text-[#a3a3a3]';
export const primaryButton =
  'flex h-12 items-center gap-2.5 rounded-[2px] bg-(--accent) px-[22px] text-[15px] font-semibold text-[#0a0a0a] hover:text-[#0a0a0a] hover:brightness-[1.08]';
export const outlineButton = `${mono} flex h-12 items-center gap-2.5 rounded-[2px] border border-white/18 px-5 text-[13px] hover:border-(--accent)`;
