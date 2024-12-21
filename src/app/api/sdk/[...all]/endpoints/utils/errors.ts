import { APIError } from 'better-call';

const ERRORS = {
  MAX_PROJECTS_LIMIT_REACHED: {
    code: 'MAX_PROJECTS_LIMIT_REACHED',
    message: 'You have reached the maximum number of projects allowed.',
  },
  PROJECT_NOT_FOUND: {
    code: 'PROJECT_NOT_FOUND',
    message: 'Project not found.',
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
