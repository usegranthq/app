import { APIError } from 'better-call';

const ERRORS = {
  MAX_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_PROVIDERS_LIMIT_REACHED',
    message: 'You have reached the maximum number of providers allowed',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    message: 'Provider not found',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    message: 'Client not found',
  },
  MAX_CLIENTS_LIMIT_REACHED: {
    code: 'MAX_CLIENTS_LIMIT_REACHED',
    message: 'You have reached the maximum number of clients allowed',
  },
  TENANT_ALREADY_EXISTS: {
    code: 'TENANT_ALREADY_EXISTS',
    message: 'Tenant with this name already exists',
  },
  TENANT_NOT_FOUND: {
    code: 'TENANT_NOT_FOUND',
    message: 'Tenant not found',
  },
  PROVIDER_ALREADY_EXISTS: {
    code: 'PROVIDER_ALREADY_EXISTS',
    message: 'Provider with this URL already exists',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Invalid JWT token',
  },
  INVALID_TOKEN_HEADERS: {
    code: 'INVALID_TOKEN_HEADERS',
    message: 'Invalid JWT token headers',
  },
  INVALID_ISSUER: {
    code: 'INVALID_ISSUER',
    message: 'Invalid issuer',
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'Token expired',
  },
};

export const SdkError = APIError;

export default ERRORS;
