import ActiveLink from '@/components/ActiveLink';

export default function SettingsNav() {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <ActiveLink href="/u/settings" className="font-semibold">
        General
      </ActiveLink>
      <ActiveLink href="/u/settings/billing" className="font-semibold">
        Billing
      </ActiveLink>
      <ActiveLink href="/u/settings/security" className="font-semibold">
        Security
      </ActiveLink>
      <ActiveLink href="/u/settings/api" className="font-semibold">
        API Keys
      </ActiveLink>
      <ActiveLink href="/u/settings/support" className="font-semibold">
        Support
      </ActiveLink>
      <ActiveLink href="/u/settings/danger" className="font-semibold">
        Danger Zone
      </ActiveLink>
    </nav>
  );
}
