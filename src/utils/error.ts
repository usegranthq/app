import { ZodError } from 'zod';

import { Prisma } from '@root/prisma/client';

type MessageHandler = (errorCode: string) => string;

type ErrorCode = 'EXISTS' | 'UNKNOWN';

export const isDbError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

const getErrorCodes = (error: unknown): ErrorCode => {
  if (isDbError(error)) {
    switch (error.code) {
      case 'P2002':
        return 'EXISTS';
      default:
        return 'UNKNOWN';
    }
  }

  return 'UNKNOWN';
};

export const getApiErrorMessage = (error: unknown, defaultMessage: string | MessageHandler) => {
  return typeof defaultMessage === 'function' ? defaultMessage(getErrorCodes(error)) : defaultMessage;
};

export const getZodErrorMessage = (error: ZodError): string => {
  return error.issues[0].message;
};

const ERRORS = {
  GENERIC_SCHEMA_VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid body parameters',
  },
  PROVIDERS_NOT_AVAILABLE: {
    code: 'PROVIDERS_NOT_AVAILABLE',
    message: 'Providers are not available under your current plan. Please upgrade to access this feature',
  },
  MAX_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_PROVIDERS_LIMIT_REACHED',
    message: 'You have reached the limit for providers. Upgrade your plan or contact support to increase the limit',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    message: 'The specified provider could not be found. Please check the provider ID and try again',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    message: 'The specified client could not be found. Please verify the client ID and try again',
  },
  CLIENT_ALREADY_EXISTS: {
    code: 'CLIENT_ALREADY_EXISTS',
    message: 'A client with this name already exists',
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
  MAX_TENANT_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_TENANT_PROVIDERS_LIMIT_REACHED',
    message: 'You have reached the maximum number of tenant providers allowed by your current plan',
  },
  MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED: {
    code: 'MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED',
    message: 'You have reached the maximum number of tenant provider policies allowed by your current plan',
  },
  TENANT_ALREADY_EXISTS: {
    code: 'TENANT_ALREADY_EXISTS',
    message: 'A tenant with this name already exists',
  },
  TENANT_NOT_FOUND: {
    code: 'TENANT_NOT_FOUND',
    message: 'The specified tenant could not be found',
  },
  TENANT_PROVIDER_NOT_FOUND: {
    code: 'TENANT_PROVIDER_NOT_FOUND',
    message: 'The specified tenant provider could not be found',
  },
  PROVIDER_ALREADY_EXISTS: {
    code: 'PROVIDER_ALREADY_EXISTS',
    message: 'A provider with this URL already exists',
  },
  TENANT_PROVIDER_ALREADY_EXISTS: {
    code: 'TENANT_PROVIDER_ALREADY_EXISTS',
    message: 'A tenant provider with this URL already exists',
  },
  TENANT_PROVIDER_POLICY_ALREADY_EXISTS: {
    code: 'TENANT_PROVIDER_POLICY_ALREADY_EXISTS',
    message: 'A tenant provider policy with this name already exists',
  },
  TENANT_PROVIDER_POLICY_NOT_FOUND: {
    code: 'TENANT_PROVIDER_POLICY_NOT_FOUND',
    message: 'The specified tenant provider policy could not be found',
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
  GENERIC_FEATURE_NOT_AVAILABLE: {
    code: 'GENERIC_FEATURE_NOT_AVAILABLE',
    message: 'This feature is not available in your current plan. Please upgrade to access this feature',
  },
  AUTOMATIC_ROTATION_ENABLED: {
    code: 'AUTOMATIC_ROTATION_ENABLED',
    message: 'Unable to rotate JWKS. Automatic rotation is enabled for this provider',
  },
  AUTOMATIC_ROTATION_ENABLED_REMOVE_KEY: {
    code: 'AUTOMATIC_ROTATION_ENABLED_REMOVE_KEY',
    message: 'Unable to remove key. Automatic rotation is enabled for this provider',
  },
  NO_KEYS_FOUND: {
    code: 'NO_KEYS_FOUND',
    message: 'No keys found for this provider',
  },
  CANNOT_REMOVE_LATEST_KEY: {
    code: 'CANNOT_REMOVE_LATEST_KEY',
    message: 'Cannot remove the latest key',
  },
  CUSTOM_DOMAINS_NOT_AVAILABLE: {
    code: 'CUSTOM_DOMAINS_NOT_AVAILABLE',
    message: 'Custom domains are not available on your current plan. Please upgrade to access this feature',
  },
  MAX_DOMAINS_LIMIT_REACHED: {
    code: 'MAX_DOMAINS_LIMIT_REACHED',
    message: 'You have reached the limit for custom domains. Please upgrade to increase the limit',
  },
  DOMAIN_ALREADY_ADDED: {
    code: 'DOMAIN_ALREADY_ADDED',
    message: 'The domain is already added',
  },
  DOMAIN_NOT_FOUND: {
    code: 'DOMAIN_NOT_FOUND',
    message: 'The specified domain could not be found',
  },
} as const;

export default ERRORS;
