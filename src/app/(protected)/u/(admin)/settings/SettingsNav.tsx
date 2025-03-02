import ROUTES from '@/constants/routes';
import NavLink from '@/components/NavLink';

export default function SettingsNav() {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <NavLink href={ROUTES.SETTINGS} className="font-semibold">
        General
      </NavLink>
      <NavLink href={ROUTES.SETTINGS_APIKEYS} className="font-semibold">
        API Keys
      </NavLink>
      <NavLink href={ROUTES.SETTINGS_BILLING} className="font-semibold">
        Billing
      </NavLink>
      <NavLink href={ROUTES.SETTINGS_SECURITY} className="font-semibold">
        Security
      </NavLink>
      <NavLink href={ROUTES.SETTINGS_SUPPORT} className="font-semibold">
        Support
      </NavLink>
      <NavLink href={ROUTES.SETTINGS_DANGER_ZONE} className="font-semibold">
        Danger Zone
      </NavLink>
    </nav>
  );
}
