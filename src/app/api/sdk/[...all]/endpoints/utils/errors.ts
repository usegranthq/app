import { APIError } from 'better-call';

type ErrMessage = {
  code: string;
  message: string;
};

const ERRORS: Record<string, ErrMessage> = {
  MAX_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_PROVIDERS_LIMIT_REACHED',
    message:
      'You have reached the maximum number of providers allowed by your current plan. Please upgrade to add more providers.',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    message: 'The specified provider could not be found. Please check the provider ID and try again.',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    message: 'The specified client could not be found. Please verify the client ID and try again.',
  },
  MAX_CLIENTS_LIMIT_REACHED: {
    code: 'MAX_CLIENTS_LIMIT_REACHED',
    message:
      'You have reached the maximum number of clients allowed by your current plan. Consider upgrading to add more clients.',
  },
  TENANTS_NOT_AVAILABLE: {
    code: 'TENANTS_NOT_AVAILABLE',
    message: 'Tenants are not available under your current plan. Please upgrade to access tenant features.',
  },
  MAX_TENANTS_LIMIT_REACHED: {
    code: 'MAX_TENANTS_LIMIT_REACHED',
    message:
      'You have reached the maximum number of tenants allowed by your current plan. Please upgrade to add more tenants.',
  },
  TENANT_ALREADY_EXISTS: {
    code: 'TENANT_ALREADY_EXISTS',
    message: 'A tenant with this name already exists. Please choose a different name.',
  },
  TENANT_NOT_FOUND: {
    code: 'TENANT_NOT_FOUND',
    message: 'The specified tenant could not be found. Please check the tenant ID and try again.',
  },
  PROVIDER_ALREADY_EXISTS: {
    code: 'PROVIDER_ALREADY_EXISTS',
    message: 'A provider with this URL already exists. Please use a different URL.',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'The provided JWT token is invalid. Please provide a valid token.',
  },
  INVALID_TOKEN_HEADERS: {
    code: 'INVALID_TOKEN_HEADERS',
    message: 'The JWT token headers are invalid. Please ensure the headers are correctly formatted.',
  },
  INVALID_ISSUER: {
    code: 'INVALID_ISSUER',
    message: 'The issuer of the token is invalid. Please verify the token issuer.',
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'The token has expired. Please obtain a new token and try again.',
  },
};

export const SdkError = APIError;

export default ERRORS;
