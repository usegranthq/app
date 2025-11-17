import { Route } from 'next';

const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  VERIFY: '/verify',
  LOGIN_CALLBACK: '/login-callback',
  DASHBOARD: '/u/providers',
  SETTINGS: '/u/settings',
  SETTINGS_BILLING: '/u/settings/billing',
  SETTINGS_APIKEYS: '/u/settings/keys',
  SETTINGS_SECURITY: '/u/settings/security',
  SETTINGS_SUPPORT: '/u/settings/support',
  SETTINGS_DANGER_ZONE: '/u/settings/danger',
  API_UNAUTHORIZED: '/api/unauthorized',
  PROVIDERS: '/u/providers',
  TENANTS: '/u/tenants',

  API_BILLING_SUCCESS_URL: `/billing/payment-confirmation`,
} as const;

export const DYNAMIC_ROUTES = {
  TENANTS_ID: (id: string) => `/u/tenants/${id}` as Route,
  TENANTS_ID_PROVIDERS_ID: (id: string, tid: string) => `/u/tenants/${id}/providers/${tid}` as Route,
  TENANTS_ID_PROVIDERS_ID_ADD: (id: string, tid: string) => `/u/tenants/${id}/providers/${tid}/add` as Route,
} as const;

export default ROUTES;
