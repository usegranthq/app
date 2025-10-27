import { createEnv } from '@t3-oss/env-nextjs';

const clientEnv = createEnv({
  client: {},
  runtimeEnv: {},
  emptyStringAsUndefined: true,
});

export default clientEnv;
