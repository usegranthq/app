export const validateBearerToken = (request: Request, secret?: string) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${secret}`;
};

export const hasBearerToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ');
};

export const getBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  return authHeader?.split(' ')[1] ?? null;
};

export const unauthorizedResponse = (message = 'Unauthorized') => {
  return new Response(message, { status: 401 });
};

export const forbiddenResponse = (message = 'Forbidden') => {
  return new Response(message, { status: 403 });
};

export const rateLimitedResponse = (message = 'Rate limited', retryAfter?: number | null) => {
  const headers = new Headers();
  if (retryAfter) {
    headers.set('Retry-After', retryAfter.toString());
  }

  return new Response(message, {
    status: 429,
    headers,
  });
};

// Ref: https://github.com/Bekacru/better-call/blob/660c2e48c5c68a63309523d386c925028f27463f/src/error.ts
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  "I'M_A_TEAPOT": 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
};
