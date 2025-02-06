export const COOKIE_PREFIX = '_ug';

const getSessionCookie = () => {
  const tokenName = 'session_token';

  if (process.env.NODE_ENV === 'production') {
    return `__Secure-${COOKIE_PREFIX}.${tokenName}`;
  }

  return `${COOKIE_PREFIX}.${tokenName}`;
};

export const SESSION_COOKIE = getSessionCookie();
export const VERIFY_COOKIE = `${COOKIE_PREFIX}.verify`;
export const INVITE_COOKIE = `${COOKIE_PREFIX}.invite`;
