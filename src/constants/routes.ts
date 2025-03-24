export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  VERIFY: '/verify',
  DASHBOARD: '/u',
  SETTINGS: '/u/settings',
  SETTINGS_BILLING: '/u/settings/billing',
  SETTINGS_APIKEYS: '/u/settings/keys',
  SETTINGS_SECURITY: '/u/settings/security',
  SETTINGS_SUPPORT: '/u/settings/support',
  SETTINGS_DANGER_ZONE: '/u/settings/danger',
  API_UNAUTHORIZED: '/api/unauthorized',
  PROVIDERS: '/u/providers',
  PROVIDERS_ID: (id: string) => `/u/providers/${id}`,
  PROVIDERS_ID_ADVANCED: (id: string) => `/u/providers/${id}/advanced`,
  PROVIDERS_ID_SETTINGS_DOMAIN: (id: string) => `/u/providers/${id}/settings/domain`,
  TENANTS: '/u/tenants',
  TENANTS_ID: (id: string) => `/u/tenants/${id}`,
  TENANTS_ID_PROVIDERS_ID: (id: string, tid: string) => `/u/tenants/${id}/providers/${tid}`,
  TENANTS_ID_PROVIDERS_ID_ADD: (id: string, tid: string) => `/u/tenants/${id}/providers/${tid}/add`,
};

export default ROUTES;
