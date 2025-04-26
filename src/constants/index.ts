import * as cookies from './cookies';
import ROUTES from './routes';

const constants = {
  ...cookies,
  ROUTES,
};

export * from './cookies';
export * from './posthog';

export default constants;
