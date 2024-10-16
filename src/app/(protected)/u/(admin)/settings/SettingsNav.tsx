import NavLink from '@/components/NavLink';

export default function SettingsNav() {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <NavLink href="/u/settings" className="font-semibold">
        General
      </NavLink>
      <NavLink href="/u/settings/tokens" className="font-semibold">
        API Tokens
      </NavLink>
      <NavLink href="/u/settings/billing" className="font-semibold">
        Billing
      </NavLink>
      <NavLink href="/u/settings/security" className="font-semibold">
        Security
      </NavLink>
      <NavLink href="/u/settings/support" className="font-semibold">
        Support
      </NavLink>
      <NavLink href="/u/settings/danger" className="font-semibold">
        Danger Zone
      </NavLink>
    </nav>
  );
}
