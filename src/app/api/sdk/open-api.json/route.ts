import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { NextResponse } from 'next/server';

import contract from '../[...all]/procedures/utils/contract';

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

const specFromContract = await openAPIGenerator.generate(contract, {
  info: {
    title: 'UseGrant SDK',
    summary: 'APIs for UseGrant SDK',
    version: '1.0.0',
    contact: {
      name: 'Support',
      url: 'https://usegrant.dev',
      email: 'support@usegrant.dev',
    },
    license: {
      name: 'Apache-2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0',
    },
  },
  servers: [
    {
      url: 'https://sdk.usegrant.dev',
      description: 'UseGrant SDK',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
    },
  },

  security: [
    {
      BearerAuth: [],
    },
  ],
});

export async function GET() {
  return NextResponse.json(specFromContract);
}
