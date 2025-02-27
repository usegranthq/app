export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  DASHBOARD: '/u',
  PROVIDERS: '/u/providers',
  SETTINGS: '/u/settings',
  SETTINGS_BILLING: '/u/settings/billing',
  API_UNAUTHORIZED: '/api/unauthorized',
  PROVIDERS_ID: {
    HOME: (id: string) => `/u/providers/${id}`,
    ADVANCED: (id: string) => `/u/providers/${id}/advanced`,
  },
};

export default ROUTES;
