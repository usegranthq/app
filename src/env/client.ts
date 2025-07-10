import { createEnv } from '@t3-oss/env-nextjs';

const env = createEnv({
  client: {},
  runtimeEnv: {},
  emptyStringAsUndefined: true,
});

export default env;
