import { SiGithubactions, SiKubernetes, SiVault } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

import AlicloudIcon from '@/components/icons/alicloud';
import AwsIcon from '@/components/icons/aws';
import AzureIcon from '@/components/icons/azure';
import GcpIcon from '@/components/icons/gcp';
import NeonDbIcon from '@/components/icons/neondb';
import env from '@/env';
import { cn } from '@/shadcn/lib/utils';

import CopyButton from '../CopyButton';
import { body, eyebrow, frame, LINKS, mono, outlineButton, primaryButton, SDK_PACKAGE, sectionTitle } from '../styles';
import CodeCard, { type CodeLine } from './CodeCard';
import TokenFlow from './TokenFlow';

const ASSUME_ROLE_LINES: CodeLine[] = [
  {
    tokens: [
      ['k', 'import'],
      ['p', ' UseGrant '],
      ['k', 'from'],
      ['s', ` '${SDK_PACKAGE}'`],
      ['p', ';'],
    ],
  },
  {
    tokens: [
      ['k', 'import'],
      ['p', ' * '],
      ['k', 'as'],
      ['p', ' aws '],
      ['k', 'from'],
      ['s', " '@aws-sdk/client-sts'"],
      ['p', ';'],
    ],
  },
  { tokens: [] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' sdk = '],
      ['k', 'new'],
      ['f', ' UseGrant'],
      ['p', '('],
      ['s', "'YOUR_API_KEY'"],
      ['p', ');'],
    ],
  },
  { tokens: [] },
  { tokens: [['c', '// get the token from usegrant']] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' resp = '],
      ['k', 'await'],
      ['p', ' sdk.'],
      ['f', 'createToken'],
      ['p', '('],
      ['s', "'providerId'"],
      ['p', ', '],
      ['s', "'clientId'"],
      ['p', ');'],
    ],
  },
  { tokens: [] },
  { tokens: [['c', '// use the token to assume a role']] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' command = '],
      ['k', 'new'],
      ['p', ' aws.'],
      ['f', 'AssumeRoleWithWebIdentityCommand'],
      ['p', '({'],
    ],
  },
  {
    indent: true,
    tokens: [
      ['p', 'RoleArn: '],
      ['s', "'arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME'"],
      ['p', ','],
    ],
  },
  {
    indent: true,
    tokens: [
      ['p', 'RoleSessionName: '],
      ['s', "'SessionName'"],
      ['p', ','],
    ],
  },
  { indent: true, tokens: [['p', 'WebIdentityToken: resp.accessToken,']] },
  { tokens: [['p', '});']] },
  { tokens: [] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' stsClient = '],
      ['k', 'new'],
      ['p', ' aws.'],
      ['f', 'STSClient'],
      ['p', '();'],
    ],
  },
  {
    tokens: [
      ['k', 'await'],
      ['p', ' stsClient.'],
      ['f', 'send'],
      ['p', '(command);'],
    ],
  },
];

const VALIDATE_LINES: CodeLine[] = [
  {
    tokens: [
      ['k', 'import'],
      ['p', ' UseGrant '],
      ['k', 'from'],
      ['s', ` '${SDK_PACKAGE}'`],
      ['p', ';'],
    ],
  },
  { tokens: [] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' sdk = '],
      ['k', 'new'],
      ['f', ' UseGrant'],
      ['p', '('],
      ['s', "'YOUR_API_KEY'"],
      ['p', ');'],
    ],
  },
  { tokens: [] },
  { tokens: [['c', '// OIDC token sent by a GitHub Actions job']] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' token = req.headers.authorization.'],
      ['f', 'slice'],
      ['p', '(7);'],
    ],
  },
  { tokens: [] },
  { tokens: [['c', '// checks signature, issuer, audience, expiry and claims']] },
  {
    tokens: [
      ['k', 'const'],
      ['p', ' { exp } = '],
      ['k', 'await'],
      ['p', ' sdk.'],
      ['f', 'validateToken'],
      ['p', '('],
    ],
  },
  {
    indent: true,
    tokens: [
      ['s', "'tenantId'"],
      ['p', ','],
    ],
  },
  {
    indent: true,
    tokens: [
      ['s', "'policyId'"],
      ['p', ','],
    ],
  },
  { indent: true, tokens: [['p', 'token,']] },
  { tokens: [['p', ');']] },
];

const POLICY_ROWS = [
  { key: 'issuer', value: 'token.actions.githubusercontent.com' },
  { key: 'audience', value: 'api.example.com' },
  { key: 'sub', operator: 'stringLike', value: 'repo:octo-org/octo-repo:*' },
];

const SELF_HOST_COMMANDS = [
  'git clone https://github.com/usegranthq/app.git usegrant',
  'cd usegrant',
  'cp .env.example .env',
  'docker build -t usegrant .',
  'DOCKER_REPOSITORY=usegrant docker compose up -d',
];

const SELF_HOST_FACTS = ['Apache-2.0', 'Docker + Postgres', 'Every feature included'];

const PRINCIPLES = [
  {
    key: 'a',
    title: 'Zero Trust',
    text: 'Complete data isolation with no visibility into your services or usage patterns.',
  },
  { key: 'b', title: 'Multi-Tenant', text: 'Isolated domain for each provider with enterprise-grade scalability.' },
  {
    key: 'c',
    title: 'Instant Provisioning',
    text: 'Instantly provision your tenant or provider in less than 200 milliseconds.',
  },
];

// providers issue tokens to clients; tenants trust tokens from external identity providers
const TOPOLOGY = [
  {
    label: 'issue tokens',
    nodes: [
      { prefix: '', kind: 'provider/', name: 'aws-prod', root: true },
      { prefix: '├─ ', kind: 'client/', name: 'billing-svc' },
      { prefix: '└─ ', kind: 'client/', name: 'ingest-worker' },
    ],
  },
  {
    label: 'trust tokens',
    nodes: [
      { prefix: '', kind: 'tenant/', name: 'acme', root: true },
      { prefix: '└─ ', kind: 'idp/', name: 'github-actions' },
      { prefix: '\u00a0\u00a0\u00a0└─ ', kind: 'policy/', name: 'main-branch' },
    ],
  },
];

const iconClassName = 'size-6';

const INTEGRATIONS = [
  { name: 'AWS', icon: <AwsIcon className={iconClassName} /> },
  { name: 'Google Cloud', icon: <GcpIcon className={iconClassName} /> },
  { name: 'Azure', icon: <AzureIcon className={iconClassName} /> },
  { name: 'Alibaba Cloud', icon: <AlicloudIcon className={iconClassName} /> },
  { name: 'Neon', icon: <NeonDbIcon className={iconClassName} /> },
  { name: 'GitHub Actions', icon: <SiGithubactions color="default" className={iconClassName} /> },
  { name: 'Kubernetes', icon: <SiKubernetes color="default" className={iconClassName} />, comingSoon: true },
  { name: 'HashiCorp Vault', icon: <SiVault color="default" className={iconClassName} />, comingSoon: true },
];

export default function Home() {
  const isInviteOnly = Boolean(env.INVITE_TOKEN);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_40%,transparent_100%)] [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-position:center_top] [background-size:48px_48px]" />
        <div
          className={cn(
            frame,
            'relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(48px,6vw,80px)] pt-[clamp(64px,10vw,128px)] pb-[clamp(56px,8vw,104px)]',
          )}
        >
          <span className={cn(mono, 'absolute -top-[7px] -left-[5px] text-xs text-[#5c5c5c]')}>+</span>
          <span className={cn(mono, 'absolute -top-[7px] -right-[5px] text-xs text-[#5c5c5c]')}>+</span>
          <div className="@container col-span-full flex min-w-0 flex-col gap-8">
            <div className={cn(mono, 'flex items-center gap-2.5 text-xs tracking-[.06em] text-[#a3a3a3] uppercase')}>
              <span className="size-1.5 bg-(--accent)" />
              <span>OAuth 2.0 client credentials · OIDC federation</span>
            </div>
            <h1 className="m-0 text-[min(112px,10cqi)] leading-[.94] font-semibold tracking-[-0.045em] text-balance">
              Automate Machine&#8209;to&#8209;Machine Auth
            </h1>
          </div>
          <div className="flex min-w-0 flex-col gap-8">
            <p className="m-0 max-w-[30em] text-[clamp(17px,1.5vw,20px)] leading-normal text-pretty text-[#a3a3a3]">
              Set up secure M2M authentication that scales in seconds. Built on OAuth standards for maximum security.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={LINKS.DOCS} className={primaryButton}>
                Read the docs <span>→</span>
              </a>
              <CopyButton
                text={`npm i ${SDK_PACKAGE}`}
                label="copy"
                copiedLabel="copied"
                className={cn(
                  mono,
                  'flex h-12 cursor-pointer items-center gap-3.5 rounded-[2px] border border-white/12 bg-[#111] px-4 text-[13px] text-[#ededed] hover:border-white/30',
                )}
                labelClassName="text-[11px] tracking-[.06em] text-[#a3a3a3] uppercase"
              >
                <span className="text-[#6f6f6f]">$</span>
                <span>npm i {SDK_PACKAGE}</span>
              </CopyButton>
            </div>
            <p className={cn(mono, 'm-0 text-[13px] text-[#8a8a8a]')}>
              {isInviteOnly
                ? 'Managed version coming soon. Open source and self-hostable today.'
                : 'Open source · Apache-2.0 · self-host it anywhere.'}
            </p>
          </div>
          <TokenFlow />
        </div>
      </section>

      <section className="border-b border-white/8">
        <div
          className={cn(
            frame,
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(40px,6vw,80px)] py-[clamp(64px,9vw,120px)]',
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            <div className={eyebrow}>
              <span className="text-(--accent)">01</span> — How it works
            </div>
            <h2 className={sectionTitle}>Trust-based Access</h2>
            <p className={body}>
              Set up UseGrant as a trusted identity provider on your preferred platform. Generate tokens from your
              identity provider and use them to access your API effortlessly.
            </p>
            <p className="m-0 border-t border-white/8 pt-6 text-[15px] leading-[1.6] text-pretty text-[#8a8a8a]">
              UseGrant leverages OAuth standards, the most popular and secure protocols for authentication and
              authorization.
            </p>
          </div>
          <CodeCard filename="assume-role.ts" lines={ASSUME_ROLE_LINES} />
        </div>
      </section>

      <section className="border-b border-white/8">
        <div
          className={cn(
            frame,
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(40px,6vw,80px)] py-[clamp(64px,9vw,120px)]',
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            <div className={eyebrow}>
              <span className="text-(--accent)">02</span> — Verify
            </div>
            <h2 className={sectionTitle}>Validate tokens from any issuer</h2>
            <p className={body}>
              Tenants act as an identity broker. Trust external OIDC issuers like GitHub Actions and write policies that
              match claims with exact values or wildcards.
            </p>
            <p className="m-0 border-t border-white/8 pt-6 text-[15px] leading-[1.6] text-pretty text-[#8a8a8a]">
              One call checks the signature, issuer, audience, expiry and token age before your service accepts the
              request. Give each customer their own tenant so their trust settings never mix.
            </p>
          </div>
          <CodeCard
            filename="validate.ts"
            lines={VALIDATE_LINES}
            footer={
              <div className={cn(mono, 'border-t border-white/8 px-5 py-4 text-xs leading-[1.9]')}>
                <div className="mb-1 text-[11px] tracking-[.06em] text-[#8a8a8a] uppercase">policy · main-branch</div>
                {POLICY_ROWS.map((row) => (
                  <div key={row.key} className="grid grid-cols-[72px_1fr] gap-3">
                    <span className="text-[#6f6f6f]">{row.key}</span>
                    <span className="wrap-anywhere text-[#d4d4d4]">
                      {row.operator && <span className="mr-2 text-(--accent)">{row.operator}</span>}
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </section>

      <section className="border-b border-white/8">
        <div className="mx-auto max-w-[1240px] border-x border-white/8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-end gap-x-20 gap-y-6 px-[clamp(20px,4vw,48px)] pt-[clamp(64px,9vw,120px)] pb-[clamp(40px,5vw,64px)]">
            <div className="flex flex-col gap-6">
              <div className={eyebrow}>
                <span className="text-(--accent)">03</span> — Architecture
              </div>
              <h2 className={sectionTitle}>Built to scale, built for security</h2>
            </div>
            <p className={cn(body, 'max-w-[28em]')}>
              Every component designed with zero-knowledge architecture and privacy-first principles.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] border-t border-white/8">
            {PRINCIPLES.map((item) => (
              <div
                key={item.key}
                className="-mb-px flex flex-col gap-4 border-r border-b border-white/8 px-[clamp(20px,4vw,48px)] pt-[clamp(28px,3vw,40px)] pb-[clamp(40px,4vw,56px)] last:border-r-0 hover:bg-[#0e0e0e]"
              >
                <span className={cn(mono, 'text-xs text-(--accent)')}>[{item.key}]</span>
                <h3 className="m-0 mt-12 text-2xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="m-0 text-base leading-[1.6] text-pretty text-[#a3a3a3]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/8">
        <div
          className={cn(
            frame,
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(40px,6vw,80px)] py-[clamp(64px,9vw,120px)]',
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            <div className={eyebrow}>
              <span className="text-(--accent)">04</span> — Infrastructure
            </div>
            <h2 className="m-0 text-[clamp(44px,6vw,80px)] leading-[.95] font-semibold tracking-[-0.045em]">
              It&apos;s all virtual
            </h2>
            <p className={cn(body, 'max-w-[32em]')}>
              No more spinning up physical servers. Scale up and down on the fly. Create providers and tenants instantly
              using the SDK or REST API, allowing you to establish trust-based access without manual configurations.
            </p>
          </div>
          <div
            className={cn(
              mono,
              'relative min-w-0 rounded border border-dashed border-white/16 p-7 text-[13px] leading-[2.1]',
            )}
          >
            <span className="absolute -top-[9px] left-5 bg-[#0a0a0a] px-2 text-[11px] tracking-[.06em] text-[#8a8a8a] uppercase">
              example topology
            </span>
            {TOPOLOGY.map((group, i) => (
              <div key={group.label} className={cn({ 'mt-4': i > 0 })}>
                <div className="text-xs text-[#5c5c5c]">{`// ${group.label}`}</div>
                {group.nodes.map((node) => (
                  <div key={node.name} className={cn('whitespace-nowrap', { 'pl-[1ch]': !node.root })}>
                    <span className="text-[#4a4a4a]">{node.prefix}</span>
                    <span className="text-[#6f6f6f]">{node.kind}</span>
                    <span className={node.root ? 'text-(--accent)' : 'text-[#d4d4d4]'}>{node.name}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/8 pt-4 text-xs leading-normal text-[#8a8a8a]">
              <span>SDK</span>
              <span>REST API</span>
              <span>no servers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/8">
        <div className="mx-auto max-w-[1240px] border-x border-white/8">
          <div className="flex max-w-[760px] flex-col gap-6 px-[clamp(20px,4vw,48px)] pt-[clamp(64px,9vw,120px)] pb-[clamp(40px,5vw,64px)]">
            <div className={eyebrow}>
              <span className="text-(--accent)">05</span> — Integrations
            </div>
            <h2 className={sectionTitle}>Authenticate with any provider</h2>
            <p className={body}>
              Authenticate seamlessly with any platform that supports OAuth 2.0 client credentials grant.
            </p>
            <p className="m-0 border-t border-white/8 pt-6 text-[15px] leading-[1.6] text-pretty text-[#8a8a8a]">
              Built on OIDC federation: each provider publishes its own discovery and JWKS endpoints, so cloud platforms
              verify useGrant tokens directly and exchange them for short-lived credentials. No long-lived keys to store
              or rotate in your services.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] border-t border-white/8">
            {INTEGRATIONS.map((integration, i) => (
              <div
                key={integration.name}
                className="group -mb-px flex min-h-[132px] flex-col justify-between gap-10 border-r border-b border-white/8 px-6 py-5 hover:bg-[#0e0e0e]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn(mono, 'text-[11px] text-[#5c5c5c]')}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0">
                    {integration.icon}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2">
                  {integration.comingSoon && (
                    <span
                      className={cn(
                        mono,
                        'rounded-[2px] border border-white/12 px-1.5 py-0.5 text-[10px] tracking-[.06em] text-[#8a8a8a] uppercase',
                      )}
                    >
                      coming soon
                    </span>
                  )}
                  <span
                    className={cn('text-xl font-medium tracking-[-0.01em]', {
                      'text-[#d4d4d4]': !integration.comingSoon,
                      'text-[#8a8a8a]': integration.comingSoon,
                    })}
                  >
                    {integration.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/8">
        <div
          className={cn(
            frame,
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(40px,6vw,80px)] py-[clamp(64px,9vw,120px)]',
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            <div className={eyebrow}>
              <span className="text-(--accent)">06</span> — Open source
            </div>
            <h2 className={sectionTitle}>Self-host it. It&apos;s yours.</h2>
            <p className={body}>
              useGrant is open source under the Apache-2.0 license. Run it on your own infrastructure with Docker and
              Postgres, keep your signing keys in your own database, and use every feature without limits.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={LINKS.GITHUB} className={primaryButton}>
                View on GitHub <span>→</span>
              </a>
              <a href={LINKS.DOCS} className={outlineButton}>
                Read the docs
              </a>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded border border-white/10 bg-[#0e0e0e]">
            <div
              className={cn(
                mono,
                'flex items-center justify-between border-b border-white/8 px-4 py-3 text-[11px] tracking-[.06em] text-[#8a8a8a] uppercase',
              )}
            >
              <span>terminal</span>
              <CopyButton
                text={SELF_HOST_COMMANDS.join('\n')}
                label="Copy"
                copiedLabel="Copied"
                className="cursor-pointer rounded-[2px] border border-white/12 bg-transparent px-2.5 py-1.5 text-[11px] tracking-[.06em] text-[#a3a3a3] uppercase hover:border-white/30 hover:text-[#ededed]"
              />
            </div>
            <div className={cn(mono, 'overflow-x-auto px-5 py-5 text-xs leading-[2] text-[#d4d4d4]')}>
              {SELF_HOST_COMMANDS.map((command) => (
                <div key={command} className="whitespace-pre">
                  <span className="mr-3 text-[#6f6f6f]">$</span>
                  {command}
                </div>
              ))}
            </div>
            <div
              className={cn(
                mono,
                'flex flex-wrap gap-x-6 gap-y-2 border-t border-white/8 px-5 py-4 text-xs leading-normal text-[#8a8a8a]',
              )}
            >
              {SELF_HOST_FACTS.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/8">
        <div className={cn(frame, 'relative flex flex-col items-start gap-10 py-[clamp(80px,12vw,160px)]')}>
          <h2 className="m-0 text-[clamp(48px,7.5vw,112px)] leading-[.92] font-semibold tracking-[-0.05em] text-balance">
            {isInviteOnly ? (
              <>
                Managed version coming soon. <span className="text-(--accent)">Self-host today.</span>
              </>
            ) : (
              <>
                Open source. <span className="text-(--accent)">Get started today.</span>
              </>
            )}
          </h2>
          <div className="flex flex-wrap gap-3">
            {isInviteOnly ? (
              <a href={LINKS.DOCS} className={primaryButton}>
                Read the docs <span>→</span>
              </a>
            ) : (
              <Link href="/login" className={primaryButton}>
                Get started <span>→</span>
              </Link>
            )}
            <a href={LINKS.GITHUB} className={outlineButton}>
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
