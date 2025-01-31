import { APIError } from 'better-call';

const ERRORS = {
  PROVIDERS_NOT_AVAILABLE: {
    code: 'PROVIDERS_NOT_AVAILABLE',
    message: 'Providers are not available under your current plan',
  },
  MAX_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_PROVIDERS_LIMIT_REACHED',
    message: 'You have reached the maximum number of providers allowed by your current plan',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    message: 'The specified provider could not be found. Please check the provider ID and try again',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    message: 'The specified client could not be found. Please verify the client ID and try again',
  },
  MAX_CLIENTS_LIMIT_REACHED: {
    code: 'MAX_CLIENTS_LIMIT_REACHED',
    message: 'You have reached the maximum number of clients allowed by your current plan',
  },
  TENANTS_NOT_AVAILABLE: {
    code: 'TENANTS_NOT_AVAILABLE',
    message: 'Tenants are not available under your current plan',
  },
  MAX_TENANTS_LIMIT_REACHED: {
    code: 'MAX_TENANTS_LIMIT_REACHED',
    message: 'You have reached the maximum number of tenants allowed by your current plan',
  },
  TENANT_ALREADY_EXISTS: {
    code: 'TENANT_ALREADY_EXISTS',
    message: 'A tenant with this name already exists',
  },
  TENANT_NOT_FOUND: {
    code: 'TENANT_NOT_FOUND',
    message: 'The specified tenant could not be found',
  },
  PROVIDER_ALREADY_EXISTS: {
    code: 'PROVIDER_ALREADY_EXISTS',
    message: 'A provider with this URL already exists',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'The provided JWT token is invalid',
  },
  INVALID_TOKEN_HEADERS: {
    code: 'INVALID_TOKEN_HEADERS',
    message: 'The JWT token headers are invalid',
  },
  INVALID_ISSUER: {
    code: 'INVALID_ISSUER',
    message: 'The issuer of the token is invalid',
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'The provided token has expired and is no longer valid',
  },
} as const;

export const SdkError = APIError;

export default ERRORS;
