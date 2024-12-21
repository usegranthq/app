import { APIError } from 'better-call';

const ERRORS = {
  MAX_PROVIDERS_LIMIT_REACHED: {
    code: 'MAX_PROVIDERS_LIMIT_REACHED',
    message: 'You have reached the maximum number of providers allowed.',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    message: 'Provider not found.',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    message: 'Client not found.',
  },
  MAX_CLIENTS_LIMIT_REACHED: {
    code: 'MAX_CLIENTS_LIMIT_REACHED',
    message: 'You have reached the maximum number of clients allowed.',
  },
};

export const SdkError = APIError;

export default ERRORS;
